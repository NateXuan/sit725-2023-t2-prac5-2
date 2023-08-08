var express = require("express")
var app = express()

const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');

const uri = "mongodb+srv://natexuan0805:B1VLM0Jk2VyiW3TA@cluster0.md8uytc.mongodb.net/myDatabase?retryWrites=true&w=majority";

app.use(express.static(__dirname + '/'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function runDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    collection = client.db().collection('Cats');
    console.log(collection);
  } catch (ex) {
    console.error(ex);
  }
}

function insertCat(cat, callback) {
  collection.insertOne(cat, callback);
}

function getAllCats(callback) {
  collection.find({}).toArray(callback);
}

function deleteCat(id, callback) {
  collection.deleteOne({ _id: new ObjectId(id) }, callback);
}

app.get('/', function (req, res) {
  res.render('index.html');
})

app.post('/api/cat', function (req, res) {
  let cat = req.body;
  insertCat(cat, (err, result) => {
    if (err) {
      res.json({ statusCode: 500, message: 'server error' });
    } else {
      res.json({ statusCode: 200, data: result, message: 'success' });
    }
  })
})

app.get('/api/cats', function (req, res) {
  getAllCats((err, result) => {
    if (!err) {
      res.json({ statusCode: 200, data: result, message: 'success' })
    }
  });
})

app.delete('/api/cat/:id', function (req, res) {
  let id = req.params.id;
  deleteCat(id, (err, result) => {
    if (err) {
      res.json({ statusCode: 500, message: 'server error' });
    } else {
      res.json({ statusCode: 200, data: result, message: 'success' });
    }
  })
})

var port = process.env.port || 3000;
app.listen(port, () => {
  console.log("App listening to: " + port)
  runDB();
})