const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const app = express.Router();

app.use(session({
    secret: "abcd",
    saveUninitialized: true,
    resave: true
}))
app.use(flash());

module.exports = app;