require("dotenv").config();
const express = require('express')
const app = express()
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 7000;

// middlewares 
app.use(cors())
app.use(express.json());

//Mongodb configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jds8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
     console.log("Connected to MongoDB successfully!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//base route
app.get('/', (req, res) => {
  res.send('Hello World!')
})
//start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

