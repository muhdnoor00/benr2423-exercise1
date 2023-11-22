
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://b022210217:Meg04fEK7vmuXK0h@class0.qzwsbgr.mongodb.net/?retryWrites=true&w=majority";

const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json())

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.patch('/profile', (req, res) => {
  console.log(req.body)
  client.db("Starting").collection("users").updateOne({
    "username": req.body.username
  }, {
    $set: {"email": req.body.email}
  }).then((result) => {
    res.send('Berjaya')
  })})

app.post('/register', (req, res) => {
  client.db("Starting").collection("users").find({
    "username": { $eq: req.body.username }
  }).toArray().then((result) => {
    console.log(result)
    if (result.length > 0) {
      res.status(400).send('Username telah wujud')
    }
    else {
        client.db("Starting").collection("users").insertOne({
          "username": req.body.username,
          "password": req.body.password
        })
        res.send('Berjaya')
    }})})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/*
  res.send('Berjaya')a
})

/*app.post('/register', (req, res) => {
  client.db("Starting").collection("users").findOne({
    if (req.body.username == 'Saya'){
      res.send('Username telah wujud')
    }
    if (username =! req.body.password){
      res.send('Password telah wujud')
    }
  })
  res.send('Cuba Cari')
})*/