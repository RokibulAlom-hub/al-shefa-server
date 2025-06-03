require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 7000;

// middlewares
app.use(cors());
app.use(express.json());

//Mongodb configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jds8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log("Connected to MongoDB successfully!");
    //user collection created
    const usersCol = client.db("AlshefaAdmin").collection("allusers");
    const appointmentCollection = client
      .db("AlshefaAdmin")
      .collection("appoinments");
    const orderRecords = client
      .db("AlshefaAdmin")
      .collection("medicineOrder");
    //  user creation operation
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCol.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await usersCol.insertOne(user);
      res.status(201).send(result);
    });
    // user get operation
    app.get("/users", async (req, res) => {
      const findusers = req.body;
      const result = await usersCol.find().toArray;
      res.send(result);
    });
    // users data get by email
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: { $regex: `^${email}$`, $options: "i" } }; //case insensitive search
      const result = await usersCol.findOne(query);
      res.send(result);
    });
    // update user status by id params
    app.patch("/update-role/:id", async (req, res) => {
      const id = req.params.id;
      const role = req.body.role;
      const filter = { _id: new ObjectId(id) };
      const updateStatus = {
        $set: {
          role: role,
        },
      };
      const result = await usersCol.updateOne(filter, updateStatus);
      res.send(result);
    });
    //appoinment booking by patient
    app.post("/appoinment", async (req, res) => {
      const appoint = req.body;
      const result = await appointmentCollection.insertOne(appoint);
      res.send(result);
    });
    //get all appoinments
    app.get("/appoinments", async (req, res) => {
      const email = req.query.email;
      if (email) {
        const query = { email: email };
        const queryResult = await appointmentCollection.find(query).toArray();
        res.send(queryResult);
      } else {
        const result = await appointmentCollection.find().toArray();
        res.send(result);
      }
    });
    // cancel appoinments
    app.patch("/appoinments/:id",async(req,res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = {_id: new ObjectId(id)};
      const updateStatus={
        $set:{
          status:status,
        },
      };
      const result = await appointmentCollection.updateOne(query,updateStatus)
      res.send(result)
    })
    // medicine order create 
    app.post("/orderMedi",async(req,res) => {
      const order = req.body;
      const result = await orderRecords.insertOne(order)
      res.send(result);
    })
    //get all order and also by query 
    app.get("/orderMedi",async(req,res) => {
      const email = req.query.email;
      if (email) {
        const query = {email: email};
        const queryResult = await orderRecords.find(query).toArray();
        res.send(queryResult);
      } else {
        const result = await orderRecords.find().toArray();
        res.send(result)
      }
    })
    //update medicine order status
    app.patch("/orderMedi/:id",async(req,res) =>{
      const id = req.params.id;
      const status = req.body.status;
      const query = {_id: new ObjectId(id)};
      const updateStatus = {
        $set:{
          status:status
        },
      }
      const result = await orderRecords.updateOne(query,updateStatus);
      res.send(result);
    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//base route
app.get("/", (req, res) => {
  res.send("Hello World!");
});
//start server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
