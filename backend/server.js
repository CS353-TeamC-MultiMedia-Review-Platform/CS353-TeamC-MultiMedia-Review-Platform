require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend baby!");
});

app.get("/health", (req, res) => {
    res.send("OK");
});

app.get("/health", (req, res) => {
    res.send("OK");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});