const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productRouters = require('./routes/Product');
const categoriesRouters = require('./routes/Category');
const brandsRouters = require('./routes/Brands');
const cors = require('cors')

server.use(express.json());
server.use(cors());

const connectToDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://avinashfortax:Abarai@cluster0.zvt00gi.mongodb.net/balajiEcomm?retryWrites=true&w=majority"
    ); // Fix the connection string
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
// connectToDB().catch((err) => console.err(err));

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.use('/products',productRouters.router);
// server.post('/products',createProduct);
server.use('/categories',categoriesRouters.router);
server.use('/brands',brandsRouters.router);

connectToDB().then(()=>{
  server.listen(8080, () => {
    console.log("yep Server Started ..");
  });
})

