const express = require("express")
const rateLimit = require("express-rate-limit")
const xss = require('xss-clean')
const helmet = require("helmet")
const hpp = require('hpp');
const cors = require("cors")
const mongoSanitize = require('express-mongo-sanitize');
var cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
require("dotenv").config();



const app = new express();



app.set('trust proxy', true);  // <-- এটি যুক্ত করুন

// Rate limit configuration
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.set('trust proxy', 'loopback'); // Only trust localhost proxy
app.set('trust proxy', '192.168.0.1'); // Trust specific IP
app.set('trust proxy', 1); // Trust the first proxy
// Using rate limit middleware
app.use(limiter)


// Using helmet for secure http response

app.use(helmet())

// Using xss-clean sanitize for body query params

app.use(xss())

// Using hpp for protect against HTTP Parameter Pollution attacks query req.body params

app.use(hpp())

// Using cors for enabling CORS

app.use(cors())

// Using MongoSanitize for sanitize user input

app.use(mongoSanitize())


// Using cookie parser for set cookie

app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Database Connect

const dbUrl = process.env.DBURL;

mongoose.connect(dbUrl).then((res) => {
    console.log("----Database Connected Successfully----")
}).catch((error) => {
    console.log("----Database Connect Failed: " + error);
});

app.get("/", async (req, res) => {
    res.send("Server run successfully");
});




// api file import


const routes = require("./src/routes/api");

app.use("/api/v1",routes);

// app.use(express.static("client/dist"));

// app.get("*",(req,res)=>{
// 	res.sendFile( path.resolve(__dirname,"client","dist","index.html") )
// })



module.exports = app