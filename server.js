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

  app.get('/test', async (req,res) => {
    let n1 =  Math.floor(Math.random() * 1000).toString()

    let n2 =  Math.floor(Math.random() * 1000).toString()

    let n3 =  Math.floor(Math.random() * 1000).toString()
    pool.query("INSERT INTO public.userinfo (idtoken, firstname, lastname) VALUES ($1,$2,$3)", [n1,n2,n3])
    res.send("Inserted random element")
  });


  app.get('/testResults', async (req,res) => {
    let results = await pool.query("SELECT * from public.userinfo")
    res.send(results.rows)
  });
// Adding new user
  app.get('/adduser/:username/:password', async (req,res) => {
    pool.query("INSERT INTO public.authentication (username, password) VALUES ($1,$2)", [req.params.username,req.params.password])
    pool.query("INSERT INTO public.categories (username) VALUES ($1)", [req.params.username])
  });
// Check if the username and password are correct
  app.get('/authentication_table', async (req,res) => {
    let results = await pool.query("SELECT * from public.authentication")
    res.send(results.rows)
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
  // Adding new user
  app.get('/addcategory/:username/:category', async (req,res) => {
    pool.query("UPDATE public.categories SET category = category || '{$2}' WHERE username = $1", [req.params.username,req.params.category])
    res.send("Added category")
  });


  app.listen(8080, () => {console.log("Running")});
  
