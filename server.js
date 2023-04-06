const express = require ('express');
const app = express();
var Pool = require('pg-pool')

var pool = new Pool({
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
  host:'quickreads.caksjqa6dpcu.us-east-2.rds.amazonaws.com',
  port: 5432,
})
  

app.get('/', async (req,res) => {
    res.send("Welcome to the Quickreads")
  });
  
app.get('/verifyAuthentication/:username/:password', async  (req,res) => {
  const client = await pool.connect();
  const username = req.params.username
  const password = req.params.password
  const query = {
          text: 'SELECT * FROM authentication WHERE username = $1 AND password = $2',
          values: [username, password],
        };
  const result = await client.query(query);
  res.send(result.rows.length > 0)
});

  





  app.listen(8080, () => {console.log("Running")});
  
