const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const MongoClient = require('mongodb').MongoClient;

const ObjectId = require('mongodb').ObjectID

require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhlcz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 4000

app.get ('/', (req, res) => {
    res.send('Its working')
}) 


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const registerCollection = client.db("volunteer").collection('registerData')

    app.get('/volunteer', (req, res) => {
        registerCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/register', (req, res) => {
        registerCollection.find({email: req.query.email})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addItems', (req, res) => {
        const item = req.body
        registerCollection.insertOne(item)
            .then(result => {
                console.log(result.insertedCount)
                res.send(result.insertedCount > 0)
            })
    })
  
    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id)
        registerCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => {
            console.log(result)
        })
    })

});

client.connect(err => {
    const itemCollection = client.db("volunteer").collection("data");
    app.get('/items', (req, res) => {
        itemCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

});




app.listen(process.env.PORT || port)