const express = require ('express');
const app = express();
  

app.get('/', async (req,res) => {
    res.send("Welcome to the Quickreads")
  });
  
  app.get('/read', async (req,res) => {
    let x = 5
    let y = 5
    let z = x + y
    res.send("" + z)
  });
  
  
  app.listen(8080, () => {console.log("Running")});
  