const express = require ('express');
const app = express();
const {Pool} = require('pg')

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

app.get('/', async (req,res) => {
    res.send("Welcome to the Quickreads")
  });

// Adding new user
  app.get('/adduser/:username/:password', async (req,res) => {
    pool.query("INSERT INTO public.authentication (username, password) VALUES ($1,$2)", [req.params.username,req.params.password])
    pool.query("INSERT INTO public.categories (username) VALUES ($1)", [req.params.username])
  });

  // Check if the username and password are correct
  app.get('/checkuser/:username/:password', async (req,res) => {
    let results = await pool.query("SELECT * FROM public.authentication WHERE username = $1", [req.params.username])
    if (results.rowCount == 0){
      res.send("username doesn't exist")
    }
    if (results.rows[0].password == req.params.password){
      res.send("true")
    }
    res.send("false")
  });
  // Remove category
  app.get('/removecategory/:username/:category', async (req,res) => {
    pool.query("UPDATE public.categories SET category = category - $2 WHERE username = $1", [req.params.username,req.params.category])
    res.send("Deleted category")
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


  // Get Categories
  app.get('/getcategory/:username', async (req,res) => {
    let results = await pool.query("SELECT category from public.categories WHERE username = $1", [req.params.username]);
    res.send(results);
  });

  // Receives article info based on category info
  app.get('/getarticles/:username', async (req,res) => {
    let results = await pool.query("SELECT category FROM public.categories WHERE username = $1", [req.params.username])
    let listofcategories = results.rows[0].category
    let temp = await pool.query("SELECT * from public.articles WHERE category = ANY($1::varchar[])", [listofcategories]);
    res.send(temp.rows)
  });

//get bookmark
  app.get('/getbookmarks/:username', async (req,res) => {
    let results = await pool.query("SELECT url from public.bookmarks WHERE username = $1", [req.params.username]);
    res.send(results.rows);
  });

  // add bookmark
  app.get('/addbookmark/:username/:url', async (req,res) => {
    await pool.query("INSERT INTO public.bookmarks(username,url) VALUES ($1,$2)", [req.params.username,req.params.url]);
    res.send();
  });

  // remove bookmark
  app.get('/removebookmark/:username/:url', async (req,res) => {
    await pool.query("DELETE FROM public.bookmarks WHERE username = $1 and url = $2", [req.params.username,req.params.url]);
    res.send();
  });
  

  app.listen(8080, () => {console.log("Running")});




