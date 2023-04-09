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
    pool.query("UPDATE public.categories SET category = category || $1::jsonb WHERE username = $2", ['[req.params.category]', req.params.username]);
    res.send("Added category");
  });
  // Get Categories
  app.get('/getcategory/:username', async (req,res) => {
    let results = await pool.query("SELECT category from public.categories WHERE username = $1", [req.params.username]);
    res.send(results);
  });

  // Receives article info based on category info
  app.get('/getarticles/:username', async (req,res) => {
    let results = await pool.query("SELECT category FROM public.categories WHERE username = $1", [req.params.username])
    res.send(results.rows[0].category)
  });

  app.listen(8080, () => {console.log("Running")});
