const express = require('express')
const mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'express',
    password: 'password',
    database: 'github'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err

    console.log(rows[0].solution)
})

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

// GET Requests

app.get('/login', (req, res) => (
    res.send("login")
))

app.get('/logout', (req, res) => (
    res.send("logout")
))

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



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))