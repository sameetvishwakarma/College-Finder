const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDb = require('./config/db');

dotenv.config();
connectDb();

const app = express();

// ✅ CORS added
app.use(cors({
    origin: "https://college-finder-jngz-g0qx9bwuc-sameets-projects-51e9647a.vercel.app/",
    credentials: true
}));

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