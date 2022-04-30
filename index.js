const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lq3tm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const connect = async () => {
  await client.connect();
};
connect();
const reviewCollection = client.db("practice").collection("items");

const runGetReview = async () => {
  // get all items
  const cursor = reviewCollection.find({});
  const data = await cursor.toArray();
  return data;
};

const runPostReview = async (review) => {
  // post  review
  const result = await reviewCollection.insertOne(review);
  return result;
};

const runGetOneReview = async (id) => {
  const query = { _id: ObjectId(id) };
  console.log(query);
  const result = await reviewCollection.findOne(query);
  return result;
};

const runUpdateReview = async (id, updatedRating) => {
  const filter = { _id: ObjectId(id) };
  const option = { upsert: true };
  const { rating } = await reviewCollection.findOne(filter);
  const updatedDoc = {
    $set: {
      rating: rating + parseFloat(updatedRating.rating),
    },
  };
  const result = await reviewCollection.updateOne(filter, updatedDoc, option);
  return result;
};

const runDeleteReview = async (id) => {
  const query = { _id: ObjectId(id) };
  const result = await reviewCollection.deleteOne(query);
  return result;
};

app.get("/review", async (req, res) => {
  const result = await runGetReview().catch(console.dir);
  res.send(result);
});
app.post("/review", async (req, res) => {
  const review = req.body;
  const result = await runPostReview(review).catch(console.dir);
  res.send(result);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await runGetOneReview(id).catch(console.dir);
  res.send(result);
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const rating = req.body;
  const result = await runUpdateReview(id, rating);
  res.send(result);
});

app.delete("/", async (req, res) => {
  const id = req.query.id;
  const result = await runDeleteReview(id).catch(console.dir);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("Server connected");
});

app.listen(port, () => {
  console.log("Server is running :D");
});
