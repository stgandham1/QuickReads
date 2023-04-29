const express = require ('express');
const app = express();
const {Pool} = require('pg')
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
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

    let authtoken = req.body.id
    let email = req.body.email
    let name = req.body.email
  
    if (!authtoken || !email || !name) {
      return res.status(400).json({ error: 'Invalid data received from Google' });
    }
  
    try {
    
      const userQuery = 'SELECT * FROM public.authentication WHERE authtoken = $1';
      const { rows } = await pool.query(userQuery, [authtoken]);
  
      let user;
  
      if (rows.length === 0) {
        
        const insertQuery =
          'INSERT INTO  public.authentication (email, name, authtoken) VALUES ($1, $2, $3) RETURNING *';
        const result = await pool.query(insertQuery, [
          email,
          name,
          authtoken,
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
      const { username, category } = req.body;
      await pool.query("UPDATE public.categories SET category = category - $2 WHERE username = $1", [username, category]);
      res.send("Deleted category");
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


  // Add Category
  app.post('/addcategorypost/', async (req, res) => {
    try {
      const { username, category } = req.body;
      const currentCategoriesResult = await pool.query("SELECT category FROM public.categories WHERE username=$1", [username]);
      let currentCategories = currentCategoriesResult.rows[0].category;
      currentCategories.push(category);
      await pool.query("UPDATE public.categories SET category = $1 WHERE username = $2", [JSON.stringify(currentCategories), username]);
      res.send(currentCategories);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });


  // Get Categories
  app.get('/getcategory/:username', async (req,res) => {
    let results = await pool.query("SELECT category from public.categories WHERE username = $1", [req.params.username]);
    res.send(results["rows"][0]["category"]);
  });

  // Receives article info based on category info
  app.get('/getarticles/:username', async (req,res) => {
    let results = await pool.query("SELECT category FROM public.categories WHERE username = $1", [req.params.username])

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
    app.get('/getarticlesbycategory/:username/:category', async (req,res) => {
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
  app.get('/getbookmarks/:username', async (req,res) => {
    let results = await pool.query("SELECT url from public.bookmarks WHERE username = $1", [req.params.username]);
    res.send(results.rows);
  });


  app.post('/removebookmarkpost', async (req, res) => {
    try {
      const { username, url } = req.body;
      await pool.query("DELETE FROM public.bookmarks WHERE username = $1 and url = $2", [username, url]);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });
  
  app.post('/addbookmarkpost', async (req, res) => {
    try {
      const { username, url } = req.body;
      await pool.query("INSERT INTO public.bookmarks(username,url) VALUES ($1,$2)", [username,url]);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  });

  app.listen(8080, () => {console.log("Running")});
