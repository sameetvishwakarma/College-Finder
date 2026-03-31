const express = require('express');
const dotenv = require('dotenv');
const connectDb = require('./config/db'); 

dotenv.config();
connectDb(); // 👈 yaha call karna important hai

const app = express();

app.use(express.json());

const collegeRoutes = require("./routes/collegeRoutes");

app.get('/', (req, res) => {
    res.send("Server Running...");
});

app.use("/api/colleges", collegeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});