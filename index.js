const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxw2z.mongodb.net/emarket?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.send("E-market Server is Running. Status 200")
})


client.connect((err) => {
  const productsCollection = client.db("emarket").collection("products");
  const ordersCollection = client.db("emarket").collection("orders");

  app.get('/products', (req,res) => {
      productsCollection.find().sort({_id: -1})
      .toArray((error, document) =>{
          res.send(document)
      })
  })

  app.post("/addProduct", (req, res) => {
    const product = req.body
    productsCollection.insertOne(product)
    .then( res => {
    })
  });

  app.delete('/deleteProduct/:id', (req,res) => {
    productsCollection.findOneAndDelete({_id : ObjectId(req.params.id)})
    .then( result => {
        productsCollection.find().sort({_id : -1})
      .toArray((error, document) =>{
          res.send(document)
      })
    })
    .catch( error => {
        res.json(error)
    })
  })

  app.get('/getSelectedProduct', (req,res) => {
      productsCollection.find({_id : ObjectId(req.query.id)})
      .toArray((error, result) =>{
          res.send(result)
      })
  })

  app.post('/addOrder' , (req,res) => {
    const order = req.body
    ordersCollection.insertOne(order)
    .then( result => {
      if( result.insertedCount > 0){
        res.send(result)
      }
  })
  })

  app.get('/getOrders', (req,res) =>{
    ordersCollection.find({email: req.query.email})
    .toArray((error, document) => {
      res.send(document)
    })
  })



});

app.listen(port, () => console.log("Server is Running"));
