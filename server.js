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
  