const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const leadRoutes =
  require("./routes/leadRoutes");

const authRoutes =
  require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/leads", leadRoutes);

app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log("MongoDB Connected");

})
.catch((error) => {

  console.log(error);

});

app.get("/", (req, res) => {

  res.send("CRM Backend Running");

});

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});