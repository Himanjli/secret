require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const app = express();
const encrypt = require('mongoose-encryption')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true })

const schema = new mongoose.Schema({
    email: String,
    pass: String
})



schema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['pass'] })

const User = new mongoose.model('User', schema);

app.get("/", function(req, res) {
    res.render('home')
})


app.get("/login", function(req, res) {
    res.render('login')
})

app.get("/register", function(req, res) {
    res.render('register')
})

app.post("/register", function(req, res) {
    const email = req.body.username;
    const pass = req.body.password;
    const newUser = new User({
        email: req.body.username,
        pass: req.body.password
    })

    newUser.save(function(err) {
        if (!err) {
            res.render('secrets')
        } else
            res.send(err)
    });
})

app.post("/login", function(req, res) {
    const email = req.body.username;
    const pass = req.body.password;
    User.findOne({ email: email }, function(err, found) {
        if (!err) {
            if (found) {
                if (found.pass === pass)
                    res.render('secrets')
                else
                    res.send("Wrong password jerk")
            }
        } else
            res.send(err)
    })
})







app.listen(3000, function() {
    console.log("Server running on Port 3000");
});