const express = require ('express');
const app = express();
var Pool = require('pg-pool')

var pool = new Pool({
  database: 'database-1',
  user: 'brianc',
  password: 'secret!',
  port: 5432,
  ssl: true,
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
})
  

app.get('/', async (req,res) => {
    res.send("Welcome to the Quickreads")
  });
  
app.get('/read', async (req,res) => {
    let x = 5
    let y = 5
    let z = x + y
    res.send("" + z)
  });

app.get('/getcategories/:username',async (req,res) => {
    let user = req.params.username
    
    res.send("" + z)
  });

let arr = [{name: 'krish', username: "krish67"}, {name: "tommy", username:"tommy123"}]

app.get('/getName/:name', async (req,res) =>
{
 let n = req.params.name
 let u = null
 for (user in arr){
  if (user.name === n){
    u = user
  }
 }

res.send(u)
}


);

  





  app.listen(8080, () => {console.log("Running")});
  