const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const mongoDB = require("./db/db");
mongoDB();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://khaloo.vercel.app"
  ],
  credentials: true
}));



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
