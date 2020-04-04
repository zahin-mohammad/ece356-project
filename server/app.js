const express = require('express')
const mysql = require('mysql')
const cors = require('cors')


var connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'express',
    password: 'password',
    database: 'github'
})

connection.connect()

// Test if database works
connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err
    if (rows[0].solution == 2) {
        console.log("MYSQL connection works")
    } else {
        console.log("MYSQL connection doesn't work")
    }
})

const app = express()
app.use(cors())
const port = 3001

// Test
app.get('/', function (req, res) {
    connection.query(`SELECT * from User where username='${"zahin-mohammad"}'`, function (err, rows, fields) {
        if (err) throw err
        if (rows.length > 1) {
            res.status(502);
            res.send('Auth error, multiple users.');
        } else {
            res.send(rows[0])
        }
    })
});

// GET Requests

app.get('/feed', (req, res) => (
    res.send("feed")
))

app.get('/comments', (req, res) => (
    res.send("comments")
))

app.get('/comments/reactions', (req, res) => (
    res.send("reactions")
))

app.get('/users', (req, res) => (
    res.send("users")
))

app.get('/following/user', (req, res) => (
    res.send("following users")
))

app.get('/repos', (req, res) => (
    res.send("repos")
))

app.get('/following/repos', (req, res) => (
    res.send("following repos")
))

// Post
app.post('/create/issue', (req, res) => (
    res.send("create comment")
))

app.post('/create/comment', (req, res) => (
    res.send("create comment")
))

app.post('/create/reaction', (req, res) => (
    res.send("create reaction")
))

app.post('/create/comment', (req, res) => (
    res.send("create comment")
))

app.post('/follow/user', (req, res) => (
    res.send("follow user")
))

app.post('/follow/repo', (req, res) => (
    res.send("follow user")
))

// Delete 

app.delete('/unfollow/user', (req, res) => (
    res.send("unfollow user")
))

app.delete('/unfollow/repo', (req, res) => (
    res.send("unfollow repo")
))

app.post('/login', function (req, res) {

    const user_name = req.body.user;
    const password = req.body.password;

    connection.query(`SELECT * from User where username=${user_name} and password=${password}`, function (err, rows, fields) {
        if (err) throw err
        if (rows.length > 1) {
            res.status(502);
            res.send('Auth error, multiple users.');
        } else {
            res.send(rows[0])
        }
    })

    res.send("login")
});

app.post('/logout', (req, res) => (
    res.send("logout")
));



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))