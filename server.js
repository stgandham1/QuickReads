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

app.get('/verifyAuthentication/:username/:password', async  (req,res) => {
  const username = req.params.username
  const password = req.params.password
  const query = {
          text: 'SELECT * FROM authentication WHERE username = $1 AND password = $2',
          values: [username, password],
        };
  const result = await pool.query(query);
  res.send(result.rows.length > 0)
});

  





  app.listen(8080, () => {console.log("Running")});
  
