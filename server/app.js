const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser');



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
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

app.get('/users', function (req, res) {
    user_name = req.query.user_name

    if (user_name) {
        var query = `
        SELECT User.username, User.name, User.avatar_url, User.email, User.last_login_time 
        FROM User
        WHERE ('${user_name}', User.username)
        NOT IN (
            SELECT * FROM FollowsUser WHERE FollowsUser.follower = '${user_name}'
        )
        `;

        connection.query(query, function (err, rows, fields) {
            if (err) throw err
            res.status(200)
            res.send(rows)
        })

    } else {
        var query = `SELECT username, name, avatar_url, email, last_login_time FROM User`
        connection.query(query, function (err, rows, fields) {
            if (err) throw err
            res.status(200)
            res.send(rows)
        })
    }

})

app.get('/following/user', function (req, res) {
    var user_name = req.query.user_name
    var query = `SELECT User.* FROM FollowsUser INNER JOIN User ON FollowsUser.followee = User.username WHERE FollowsUser.follower = '${user_name}'`

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
});

app.get('/repos', (req, res) => (
    res.send("repos")
))

app.get('/following/repository', function (req, res) {
    user_name = req.query.user_name
    var query = `SELECT Repository.* FROM FollowsRepository INNER JOIN Repository ON Repository.name = FollowsRepository.repository_name WHERE FollowsRepository.follower='${user_name}'`
    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
});

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

    connection.query(`SELECT * from User where username='${user_name}' and password='${password}'`, function (err, rows, fields) {
        if (err) throw err
        if (rows.length != 1) {
            res.status(401);
            res.send('Auth error.');
        } else {
            res.status(200)
            res.send(rows[0])
        }
    })
});




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))