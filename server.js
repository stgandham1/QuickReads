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
        await pool.query("INSERT INTO public.country(id,country) VALUES ($1,$2)", [id,'en']);
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

  const runPrompt = async (url) => {
    const prompt = `
      Summarize this article in 3 different lengths, one short, one medium, and one long: ${url}
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
   
  
  
  
  
  async function fetchArticles(topic) {
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
    let arr = [];
    try {
      const excludedDomain = 'consent.google.com,news.google.com'; // replace with your desired excluded domain(s)
      const response = await fetch(`https://newsapi.org/v2/everything?q=${topic}&from=${todayFormatted}&to=${yesterdayFormatted}&language=en&excludeDomains=${excludedDomain}&apiKey=b96538face724581aae3298f379c3895`);
      const data = await response.json();
      let articles = data.articles;
      for(let i=0; i<5; i++) {
        let shortSummary,mediumSummary,longSummary;
        try {
          const result = await runPrompt(articles[i].url);
          shortSummary = result.shortSummary;
          mediumSummary = result.mediumSummary;
          longSummary = result.longSummary;
        } catch(error) {
          console.error(error);
        }
        arr.push({
          title: articles[i].title,
          category: topic,
          url: articles[i].url,
          imageurl: articles[i].urlToImage,
          shortsummary: shortSummary,
          mediumsummary: mediumSummary,
          longsummary: longSummary
        });
      }
      return arr;
    } catch(error) {
      console.error(error);
      throw error; // re-throw the error so that it can be caught by an outer try/catch block if necessary
    }
  }
  
  async function doSearch(topic) {
    try {
      const result = await fetchArticles(topic);
      return result;
    } catch (error) {
      console.error(error);
      throw error; // re-throw the error so that it can be caught by an outer try/catch block if necessary
    }
  }

  app.get('/addarticlestest', async (req, res) => {
    try {
      let results = await pool.query("SELECT DISTINCT jsonb_array_elements_text(category) AS category from public.categories");
      var a = results["rows"];
      var categories = [];
      for (var i = 0; i < a.length; i++) {
        categories.push(a[i].category);
      }
      for (const category of categories){
        const searchResult = await doSearch(category); // Wait for doSearch() to complete
        for (const article of searchResult) {
          if (article.shortsummary === null || article.mediumsummary === null || article.longsummary === null){
            continue
          }
          const imageUrl = article.imageurl ? article.imageurl : 'https://img.freepik.com/premium-photo/golden-retriever-lying-panting-isolated-white_191971-16974.jpg';
          await pool.query('INSERT INTO public.updatedarticles(title, category, url, imageurl, shortsummary, mediumsummary, longsummary) VALUES ($1,$2,$3,$4,$5,$6,$7);',[article.title,category,article.url,imageUrl,article.shortsummary,article.mediumsummary,article.longsummary]);
        }
      }
      res.send('Articles added successfully');  
    } catch(error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
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
  

  
  // Remove category




  app.get('/getcountry/:id', async (req,res) => {
    let results = await pool.query("SELECT country from public.country WHERE id = $1", [req.params.id]);
    res.send(results["rows"][0]["country"]);
  });

  app.post('/changecountry', async (req, res) => {
    try {
      let id = req.body.id
      let country = req.body.country
      await pool.query("UPDATE public.country SET country = $1 WHERE id = $2", [country, id]);
      res.send("Updated successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }); 


  // Add Category
  app.post('/addcategorypost/', async (req, res) => {
    try {
      const { id, category } = req.body;
      const currentCategoriesResult = await pool.query("SELECT category FROM public.categories WHERE id=$1", [id]);
      console.log(currentCategoriesResult)
      console.log(currentCategoriesResult.rows[0])
      let currentCategories = currentCategoriesResult.rows[0].category;
      currentCategories.push(category);
      await pool.query("UPDATE public.categories SET category = $1 WHERE id = $2", [JSON.stringify(currentCategories), id]);
      res.send(currentCategories);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  // Remove categories
  app.post('/removecategorypost', async (req, res) => {
    try {
      const { id, category } = req.body;
      await pool.query("UPDATE public.categories SET category = category - $2 WHERE id = $1", [id, category]);
      res.send("Deleted category");
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  // Get Categories
  app.get('/getcategory/:id', async (req,res) => {
    let results = await pool.query("SELECT category from public.categories WHERE id = $1", [req.params.id]);
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

//get bookmark
  app.get('/getbookmarks/:id', async (req,res) => {
    let results = await pool.query("SELECT url from public.bookmarks WHERE id = $1", [req.params.id]);
    res.send(results.rows);
  });


  app.post('/removebookmarkpost', async (req, res) => {
    try {
      const { id, url } = req.body;
      await pool.query("DELETE FROM public.bookmarks WHERE id = $1 and url = $2", [id, url]);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
  app.post('/addbookmarkpost', async (req, res) => {
    try {
      const { id, url } = req.body;
      await pool.query("INSERT INTO public.bookmarks(id,url) VALUES ($1,$2)", [id,url]);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  
  app.get('/getblacklist/:id', async (req,res) => {
    let results = await pool.query("SELECT site from public.blacklist WHERE id = $1", [req.params.id]);
    res.send(results.rows);
  });

  app.post('/addblacklist', async (req, res) => {
    try {
      const { id, site } = req.body;
      await pool.query("INSERT INTO public.blacklist(id,site) VALUES ($1,$2)", [id,site]);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  app.post('/removeblacklist', async (req, res) => {
    try {
      const { id, site } = req.body;
      await pool.query("DELETE FROM public.blacklist WHERE id = $1 and site = $2", [id, site]);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  app.listen(8080, () => {console.log("Running")});
