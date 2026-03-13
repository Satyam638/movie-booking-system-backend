const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// connect to Database
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database is Connected Successfully');
    console.log('Database: ',mongoose.connection.name);
    app.listen(PORT, () => {
        console.log(`Your server is running on http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.log("Database connection error:", err);
});