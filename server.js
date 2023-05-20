const express = require ('express');
const { Configuration, OpenAIApi } = require("openai");
const config = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

const app = express();
const {Pool} = require('pg')
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
const axios = require('axios');
const pool = new Pool({

  host: process.env.RDS_HOSTNAME,
  user:process.env.RDS_USERNAME,
  port:process.env.RDS_PORT,
  password:process.env.RDS_PASSWORD,
  database:process.env.RDS_DB_NAME,
  ssl: {
    rejectUnauthorized: false,
}
});



pool.connect()

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());

app.get('/', async (req,res) => {
    res.send("Welcome to the Quickreads")
  });

  app.post('/auth', async (req, res) => {

    let id = req.body.id
    let email = req.body.email
    let name = req.body.name
  
    if (!id || !email || !name) {
      return res.status(400).json({ error: 'Invalid data received from Google' });
    }
  
    try {
    
      const userQuery = 'SELECT * FROM public.authorization WHERE id = $1';
      const { rows } = await pool.query(userQuery, [id]);
  
      let user;
  
      if (rows.length === 0) {
        
        await pool.query
        const insertQuery =
          'INSERT INTO  public.authorization (id, email, name) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(insertQuery, [
          id,
          email,
          name,
        ]);
        await pool.query("INSERT INTO public.categories(id) VALUES ($1)", [id]);
        await pool.query("INSERT INTO public.country(id,country) VALUES ($1,$2)", [id,"us"]);
	await pool.query("INSERT INTO public.summarylength(id,length) VALUES ($1,$2)", [id,"medium"]);

        user = result.rows[0];
      } else {
       
        user = rows[0];
      }
  
     
      
      res.status(200).json({ message: 'User signed in successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  });

  const runPrompt = async (lang,url) => {
    const prompt = `
      Summarize this article in ${lang} language and in 3 different lengths, one short, one medium, and one long: ${url}
      The summaries should start with "short","medium" and "long"
      `;
  
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 1,
    });
      article = response.data.choices[0].text
      const shortSummary = article.split("Short: ")[1].split("\n")[0];
      const mediumSummary = article.split("Medium: ")[1].split("\n")[0];
      const longSummary = article.split("Long: ")[1].split("\n")[0];
    return {shortSummary, mediumSummary, longSummary};
  };
   
  
  
  
  // Main Function for getting articles from newsapi and getting the summaries for each article from chatgpt api
  async function fetchArticles(lang,topic) {
    // Getting today's and yesterday's date in the correct format to pass to newsapi
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yearToday = today.getFullYear();
    const monthToday = String(today.getMonth() + 1).padStart(2, '0');
    const dayToday = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${yearToday}-${monthToday}-${dayToday}`;
    
    const yearYesterday = yesterday.getFullYear();
    const monthYesterday = String(yesterday.getMonth() + 1).padStart(2, '0');
    const dayYesterday = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayFormatted = `${yearYesterday}-${monthYesterday}-${dayYesterday}`;
    // articles_arr will consists of all the article objects
    let articles_arr = [];
    try {
      const excludedDomain = 'consent.google.com,news.google.com';
      // Making a request to the newsapi 
      const response = await fetch(`https://newsapi.org/v2/everything?q=${topic}&from=${yesterdayFormatted}&to=${todayFormatted}&language=${lang}&excludeDomains=${excludedDomain}&apiKey=b96538face724581aae3298f379c3895`);
      const data = await response.json();
      let articles = data.articles;
      // Maximum 5 articles will be returned. If the newsapi gives less than 5 articles, then only that many articles will be returned.
      for(let i=0; i<Math.min(5, articles.length); i++) {
        let shortSummary,mediumSummary,longSummary;
        try {
          const result = await runPrompt(lang,articles[i].url);
          shortSummary = result.shortSummary;
          mediumSummary = result.mediumSummary;
          longSummary = result.longSummary;
        } catch(error) {
          console.error(error);
        }
        // Adding the article object to the articles array
        articles_arr.push({
          title: articles[i].title,
          category: topic,
          url: articles[i].url,
          imageurl: articles[i].urlToImage,
          shortsummary: shortSummary,
          mediumsummary: mediumSummary,
          longsummary: longSummary
        });
      }
      return articles_arr;
    } catch(error) {
      console.error(error);
      throw error; 
    }
  }
  
  // This function is called by the route and it calls the fetcharticles route. It returns array of articles for given language and category (topic)
  async function doSearch(lang,topic) {
    try {
      const result = await fetchArticles(lang,topic);
      return result;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
  // This is the route for adding main feed articles to the database table
  app.get('/addarticles', async (req, res) => {
    try {
      // Removing previous articles from the table
      await pool.query("DELETE FROM public.updatedarticles")
      let b = await pool.query("SELECT u.lang, c.category FROM public.authorization u JOIN public.categories c ON c.id = u.id;");
      a = b.rows
      let result = {};

      // Loop through each element in array a
      for(let i = 0; i < a.length; i++) {
        let lang = a[i].lang;
        let category = a[i].category;

        // Add category to existing language key or create a new language key with the category
        if(result[lang]) {
          result[lang] = result[lang].concat(category);
        } else {
          result[lang] = category;
        }
      }

      // Remove duplicates from each value in the object
      for(let key in result) {
        result[key] = [...new Set(result[key])];
      }
      // result consists of key value pairs where key is language and value is array of categories
      for(let lang in result) {
        // Get the value corresponding to the key and loop through it
        let categories = result[lang];
        // Looping through each category for the current language
        for(let i = 0; i < categories.length; i++) {
          const searchResult = await doSearch(lang,categories[i]);
          // Adding all the articles to the database for the current language and category 
          for (const article of searchResult) {
            if (article.shortsummary === null || article.mediumsummary === null || article.longsummary === null){
              continue
            }
            const imageUrl = article.imageurl ? article.imageurl : 'https://media.istockphoto.com/id/1166832903/photo/detail.jpg?b=1&s=170667a&w=0&k=20&c=0z5bwVx4SHoU3txpY-Q6we_XtQluSCPPLaM5zZ9UO74=';
            await pool.query('INSERT INTO public.updatedarticles(title, category, url, imageurl, shortsummary, mediumsummary, longsummary,lang) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);',[article.title,categories[i],article.url,imageUrl,article.shortsummary,article.mediumsummary,article.longsummary,lang]);
        }
        }
      }
      res.send('Articles added successfully');  
    } catch(error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  // This function takes country as parameter and returns an array of article objects of top news for that country. 
  async function topfetchArticles(country) {
    try {
      let articles_arr = [];
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=3bf34ff8fdb24f628e456a5fc1eb7131`);
      const data = await response.json();
      let articles = data.articles;
      // Adding only 5 articles
      for(let i=0; i<5; i++) {
        let shortSummary,mediumSummary,longSummary;
        try {
          // Getting the summary of three lengths from chatgpt api using runprompt() function
          const result = await runPrompt("english",articles[i].url);
          shortSummary = result.shortSummary;
          mediumSummary = result.mediumSummary;
          longSummary = result.longSummary;
        } catch(error) {
          console.error(error);
        }
        // Adding article object to the articles array
        articles_arr.push({
          title: articles[i].title,
          url: articles[i].url,
          imageurl: articles[i].urlToImage,
          shortsummary: shortSummary,
          mediumsummary: mediumSummary,
          longsummary: longSummary
        });
      }
      return articles_arr;
    } catch(error) {
      console.error(error);
      throw error; 
    }
  }
  
  // This function is called by the addtoparticles route and it calls the fetcharticles route. It returns array of articles for given language and category (topic)
  async function topdoSearch(country) {
    try {
      const result = await topfetchArticles(country);
      return result;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
  // Route for adding articles to the top news data table
  app.get('/addtoparticles', async (req, res) => {
    try {
      // Removing previous data from the table
      await pool.query("DELETE FROM public.toparticles"); 
      // Getting list of distinct countries that all the users have selected
	  let temp = await pool.query("SELECT DISTINCT country FROM public.country");
      countries = temp.rows;
      // Looping through each country 
	  for (let i = 0; i < countries.length; i++) {
            // Fetching the articles for that country and adding it to the database table
            const searchResult = await topdoSearch(countries[i]["country"]);
            for (const article of searchResult) {
              if (article.shortsummary === null || article.mediumsummary === null || article.longsummary === null){
                continue
              }
              const imageUrl = article.imageurl ? article.imageurl : 'https://media.istockphoto.com/id/1166832903/photo/detail.jpg?b=1&s=170667a&w=0&k=20&c=0z5bwVx4SHoU3txpY-Q6we_XtQluSCPPLaM5zZ9UO74=';
              await pool.query('INSERT INTO public.toparticles(title, url, imageurl, shortsummary, mediumsummary, longsummary,country) VALUES ($1,$2,$3,$4,$5,$6,$7);',[article.title,article.url,imageUrl,article.shortsummary,article.mediumsummary,article.longsummary,countries[i]["country"]]);
            }
          }
          res.send('Articles added successfully');  
    } catch(error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  app.get('/getcountries/', async (req,res) => {
    let results = await pool.query("SELECT DISTINCT country FROM public.country");
    res.send(results.rows);
  });

  app.get('/getlang/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: 'Missing required field: id' });
      }
  
      const selectQuery = `
        SELECT lang
        FROM public.authorization
        WHERE id = $1;
      `;
  
      const result = await pool.query(selectQuery, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `No record found for id: ${id}` });
      }
  
      res.status(200).json({ id, lang: result.rows[0].lang });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.post('/updatelang', async (req, res) => {
    try {
      let id = req.body.id
      let lang = req.body.lang

  
      if (!id || !lang) {
        return res.status(400).json({ error: 'Missing required fields: id and lang' });
      }
  
      const updateQuery = `
        UPDATE public.authorization
        SET lang = $1
        WHERE id = $2;
      `;
  
      await pool.query(updateQuery, [lang, id]);
      res.status(200).json({ message: `Lang successfully updated for id: ${id}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// GET request which fetches a user's summary length given user ID
  app.get('/getsummarylength/:id', async (req,res) => {
    let results = await pool.query("SELECT length from public.summarylength WHERE id = $1", [req.params.id]); //Searches summarylength table for summary length given user ID
    res.send(results["rows"][0]["length"]);
  });

  // POST request which changes a user's summary length given user ID and length
  app.post('/changesummarylength', async (req, res) => {
    try {
      let id = req.body.id
      let length = req.body.length //Parses id and length from the body of the request
      await pool.query("UPDATE public.summarylength SET length = $1 WHERE id = $2", [length, id]); //Changes the users summary length by searching for user ID
      res.send("Updated successfully");
    } catch (error) { //Catches error
      console.error(error);
      res.status(500).send(error);
    }
  }); 

  
  // Remove category



  // GET request which fetches a user's country given user ID
  app.get('/getcountry/:id', async (req,res) => {
    let results = await pool.query("SELECT country from public.country WHERE id = $1", [req.params.id]); //Searches country table for country given user ID
    res.send(results["rows"][0]["country"]);
  });

  // POST request which changes a user's country given user ID and country
  app.post('/changecountry', async (req, res) => {
    try {
      let id = req.body.id
      let country = req.body.country //Parses id and country from the body of the request
      await pool.query("UPDATE public.country SET country = $1 WHERE id = $2", [country, id]); //Changes the users country by searching for user ID
      res.send(currentCategories);
      res.send("Updated successfully");
    } catch (error) { //Catches error
      console.error(error);
      res.status(500).send(error);
    }
  }); 


  // POST request which adds a user's category given user ID and category
  app.post('/addcategorypost/', async (req, res) => {
    try {
      const { id, category } = req.body; //Parses id and categoy from the body of the request
      const currentCategoriesResult = await pool.query("SELECT category FROM public.categories WHERE id=$1", [id]);
      console.log(currentCategoriesResult)
      console.log(currentCategoriesResult.rows[0])
      let currentCategories = currentCategoriesResult.rows[0].category;
      currentCategories.push(category);
      await pool.query("UPDATE public.categories SET category = $1 WHERE id = $2", [JSON.stringify(currentCategories), id]); //Adds category to the categories table by seraching for the ID and pushing a new category to the array
      res.send(currentCategories);
    } catch (error) { //Catches error
      console.error(error);
      res.status(500).send(error);
    }
  });

  // POST request which removes a user's category given user ID and category
  app.post('/removecategorypost', async (req, res) => {
    try {
      const { id, category } = req.body; //Parses id and categoy from the body of the request
      await pool.query("UPDATE public.categories SET category = category - $2 WHERE id = $1", [id, category]); //Removes category from the categories table by seraching for the ID
      res.send("Deleted category");
    } catch (error) { //Catches error
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  // GET request which fetches a user's news categories given user ID
  app.get('/gettoparticles', async (req,res) => {
    let temp = await pool.query("SELECT * from public.toparticles");
    let responseList = []
    
    for (r of temp.rows){
      responseList.push({title: r.title,category:r.category, newsurl:r.url,imageurl:r.imageurl,shortsummary:r.shortsummary,mediumsummary:r.mediumsummary,longsummary:r.longsummary})
    }
    res.json(responseList)
  });

// GET request which fetches a user's news categories given user ID
app.get('/getcategory/:id', async (req,res) => {
    let results = await pool.query("SELECT category from public.categories WHERE id = $1", [req.params.id]); //Searches for category associated with the user ID
    res.send(results["rows"][0]["category"]);
  });


  // Receives article info based on category info
  app.get('/getarticles/:id', async (req,res) => {
    let results = await pool.query("SELECT category FROM public.categories WHERE id = $1", [req.params.id])

    let listofcategories = results.rows[0].category

    let temp = await pool.query("SELECT * from public.updatedarticles WHERE category = ANY($1::varchar[])", [listofcategories]);
    let responseList = []
    
    for (r of temp.rows){
      responseList.push({title: r.title,category:r.category, newsurl:r.url,imageurl:r.imageurl,shortsummary:r.shortsummary,mediumsummary:r.mediumsummary,longsummary:r.longsummary})
    }
    res.json(responseList)
  });

    // Receives article info based on category info
    app.get('/getarticlesbycategory/:category', async (req,res) => {
      let temp = await pool.query("SELECT * from public.updatedarticles WHERE category = $1", [req.params.category]);
      let responseList = []
      
      for (r of temp.rows){
        console.log(r.title)
        console.log(r.summary)
        responseList.push({title: r.title,category:r.category, newsurl:r.url,imageurl:r.imageurl,shortsummary:r.shortsummary,mediumsummary:r.mediumsummary,longsummary:r.longsummary})
      }
      res.json(responseList)
    });

// GET request which fetches a user's bookmarks given user ID
  app.get('/getbookmarks/:id', async (req,res) => {
    let results = await pool.query("SELECT url from public.bookmarks WHERE id = $1", [req.params.id]); //Searches for url associated with the user ID
    res.send(results.rows);
  });

// POST request which removes a user's bookmark given user ID and url of the bookmark
  app.post('/removebookmarkpost', async (req, res) => {
    try {
      const { id, url } = req.body; //Parses id and url from the body of the request
      await pool.query("DELETE FROM public.bookmarks WHERE id = $1 and url = $2", [id, url]); //Removes bookmark url from the bookmarks table by seraching for the ID and URL
      res.send();
    } catch (error) { //Catches error
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
  // POST request which adds a user's bookmark given user ID and url of the bookmark
  app.post('/addbookmarkpost', async (req, res) => {
    try {
      const { id, url } = req.body; //Parses id and url from the body of the request
      await pool.query("INSERT INTO public.bookmarks(id,url) VALUES ($1,$2)", [id,url]); //Adds user id and bookmark url to the bookmarks table
      res.send();
    } catch (error) { //Catches error
      console.error(error);
      res.status(500).send(error);
    }
  });
  

  app.listen(8080, () => {console.log("Running")});
