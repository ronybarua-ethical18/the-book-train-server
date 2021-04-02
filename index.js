const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = process.env.PORT || 5000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qoxmw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("bookdb").collection("books");
  const orderedBooks = client.db("bookdb").collection("orderedbooks");
  // create data in database 
  app.post('/addBook', (req, res) => {
    const booksData = req.body;
    booksCollection.insertOne(booksData)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
      })
  })

  // read or retrieve data from database 
  app.get('/books', (req, res) => {
    booksCollection.find()
      .toArray((error, documents) => {
        res.send(documents);
      })
  })

  //get single book by id
  app.get('/book/:id', (req, res) => {
    booksCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((error, documents) => {
        res.send(documents[0]);
      })
  })

  // delete data from database
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id)
    booksCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result)
        res.send(result.deletedCount > 0);

      })
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    orderedBooks.insertOne(newOrder)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount > 0)

      })
    console.log(newOrder);
  })

  //get item by email
  app.get('/orders', (req, res) => {
    orderedBooks.find({ email: req.query.email })
      .toArray((error, documents) => {
        res.status(200).send(documents);
      })
  })
  console.log('database connected successfully')
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)