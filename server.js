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


var runPrompt = async (url) => {
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
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastyear = lastWeek.getFullYear();
    const lastmonth = String(lastWeek.getMonth() + 1).padStart(2, '0');
    const lastday = String(lastWeek.getDate()).padStart(2, '0');
    const lastWeekFormatted = `${lastyear}-${lastmonth}-${lastday}`;
    let arr = [];
    const response = await fetch(`https://newsapi.org/v2/everything?q=${topic}&from=${todayFormatted}&to=${lastWeekFormatted}&sortBy=popularity&apiKey=${NEWS_API_KEY}`);
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
  }
}

app.get('/addarticles', async (req,res) => {
  try{
    let results = await pool.query("SELECT DISTINCT jsonb_array_elements_text(category) AS category from public.categories");
    var a = results["rows"];
    var categories = [];
    for (var i = 0; i < a.length; i++) {
      categories.push(a[i].category);
    }
    let articles = []
  //   categories.forEach(element => {
  //   fetchArticles(element).then(result => {
  //     articles.concat(result)
  //   }).catch(error => {
  //     console.error(error);
  //   });
  // });
  fetchArticles("Finance").then(result => {
        articles.concat(result)
        res.send(result)
        console.log(result)
      })
  res.send(articles);
} catch{
  console.error(error);
  res.send(error);
}

});

  app.post('/adduserpost', async (req, res) => {
    const { username, password } = req.body;
    try {
      await pool.query("INSERT INTO public.authentication (username, password) VALUES ($1,$2)", [username,password])
      await pool.query("INSERT INTO public.categories (username) VALUES ($1)", [username])
      res.send('User created');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  // Check if the username and password are correct
app.get('/checkuser/:username/:password', async (req,res) => {
    let results = await pool.query("SELECT * FROM public.authentication WHERE username = $1", [req.params.username])
    if (results.rowCount == 0){
      console.log("false")
      res.json({status: false, message: "Username does not exist"})
    }else  if (results.rows[0].password == req.params.password){
      console.log("true")
      res.json({status: true, message: "User exists and password matches"})

    }else{
      console.log("false")
      res.json({status: false, message: "Username does not exist"})
    }
    
  });

  app.get('/checkuserpost/:username/:password', async (req, res) => {
    try {
      const results = await pool.query("SELECT * FROM public.authentication WHERE username = $1", [req.params.username]);
      if (results.rowCount == 0) {
        console.log("false");
        res.json({ status: false, message: "Username does not exist" });
      } else if (results.rows[0].password == req.params.password) {
        console.log("true");
        res.json({ status: true, message: "User exists and password matches" });
      } else {
        console.log("false");
        res.json({ status: false, message: "Invalid password" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
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
        await pool.query("INSERT INTO public.categories(id) VALUES ($1)", [id]);
        const insertQuery =
          'INSERT INTO  public.authorization (id, email, name) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(insertQuery, [
          id,
          email,
          name,
        ]);
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
  
  // Remove category

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

  // Add Category
  app.get('/addcategory/:username/:category', async (req,res) => {
    const { username, category } = req.params;
      const currentCategoriesResult = await pool.query("SELECT category FROM public.categories WHERE username=$1", [username]);
      let currentCategories = currentCategoriesResult.rows[0].category;
      currentCategories.push(category);
      await pool.query("UPDATE public.categories SET category = $1 WHERE username = $2", [JSON.stringify(currentCategories), username]);
      res.send(currentCategories)
      
  });

  app.post('/ask', async (req, res) => {
    try {
      const question = req.body.question;
  
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: question,
        max_tokens: 150,
        n: 1,
        stop: ['\n']
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${process.env.OPENAI_API_KEY}'
        }
      });
  
      const answer = response.data.choices[0].text.trim();
      res.send(answer);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });


  // Get Categories
  app.get('/getcategory/:id', async (req,res) => {
    let results = await pool.query("SELECT category from public.categories WHERE id = $1", [req.params.id]);
    res.send(results["rows"][0]["category"]);
  });

  app.get('/getcategories', async (req,res) => {
    let results = await pool.query("SELECT DISTINCT jsonb_array_elements_text(category) AS category from public.categories");
    var a = results["rows"];
    var valuesOnly = [];
    for (var i = 0; i < a.length; i++) {
      valuesOnly.push(a[i].category);
    }
    res.send(valuesOnly);
  });

  // Receives article info based on category info
  app.get('/getarticles/:id', async (req,res) => {
    let results = await pool.query("SELECT category FROM public.categories WHERE id = $1", [req.params.id])

    let listofcategories = results.rows[0].category

    let temp = await pool.query("SELECT * from public.articles WHERE category = ANY($1::varchar[])", [listofcategories]);
    let responseList = []
    console.log("SQL add")
    
    for (r of temp.rows){
      console.log(r.title)
      console.log(r.summary)
      responseList.push({title: r.title, summary: r.summary,newsurl:r.url,imageurl:r.imageurl,category:r.category})
    }
    console.log(responseList)
    res.json(responseList)
  });

    // Receives article info based on category info
    app.get('/getarticlesbycategory/:category', async (req,res) => {
      let temp = await pool.query("SELECT * from public.articles WHERE category = $1", [req.params.category]);
      let responseList = []
      console.log("SQL add")
      
      for (r of temp.rows){
        console.log(r.title)
        console.log(r.summary)
        responseList.push({title: r.title, summary: r.summary,newsurl:r.url,imageurl:r.imageurl,category:r.category})
      }
      console.log(responseList)
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

  app.get('/stubtestinggetbookmarks/', async (req,res) => {
    let results = await pool.query("SELECT url from public.bookmarks WHERE username = $1", ['accountName']);
    res.send(results.rows); 
  });

  // black box test for duplicate entries
  app.post('/blackboxtestingaddbookmarkpost', async (req, res) => {
    try {
      const { username, url } = req.body;
      await pool.query("INSERT INTO public.bookmarks(username,url) VALUES ($1,$2)", [username,url]);
      await pool.query("INSERT INTO public.bookmarks(username,url) VALUES ($1,$2)", [username,url]);
      let results = await pool.query("SELECT url from public.bookmarks WHERE username = $1", [username]);
      res.send(results.rows); 
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });

  app.listen(8080, () => {console.log("Running")});
