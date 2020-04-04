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

app.get('/feed', function (req, res) {
    var user_name = req.query.user_name

    if (!user_name) {
        throw ("No username supplied")
    }

    var query = `
    select Post.*, User.username, User.name, User.avatar_url, User.email, User.last_login_time
    FROM Post
    INNER JOIN User ON User.username = Post.username
    INNER JOIN FollowsUser on FollowsUser.followee = Post.username
    WHERE FollowsUser.follower = '${user_name}'
    UNION
    select Post.*, User.username, User.name, User.avatar_url, User.email, User.last_login_time
    FROM Post
    INNER JOIN User ON User.username = Post.username
    INNER JOIN Repository ON Repository.name = Post.repository_name
    INNER JOIN FollowsRepository ON FollowsRepository.repository_name = Post.repository_name
    WHERE FollowsRepository.follower = '${user_name}'; 
    `
    postsFromUsersWeFollow = []
    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
});

app.get('/comments', (req, res) => (
    res.send("comments")
))

app.get('/comments/reactions', (req, res) => (
    res.send("reactions")
))

app.get('/users', function (req, res) {
    user_name = req.query.user_name

    if (user_name) { // get all users that user_name doesn't follow
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

    } else {  // get all users
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
    var query = `
    SELECT User.username, User.name, User.avatar_url, User.email, User.last_login_time 
    FROM FollowsUser 
    INNER JOIN User 
    ON FollowsUser.followee = User.username 
    WHERE FollowsUser.follower = '${user_name}'
    `;

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
});

app.get('/repository', function (req, res) {
    user_name = req.query.user_name

    if (user_name) { // get all repo's that user_name doesn't follow
        var query = `
        SELECT Repository.* 
        FROM Repository
        WHERE ('${user_name}', Repository.name)
        NOT IN (
            SELECT * FROM FollowsRepository WHERE FollowsRepository.follower = '${user_name}'
            )
        `;

        connection.query(query, function (err, rows, fields) {
            if (err) throw err
            res.status(200)
            res.send(rows)
        })

    } else {  // get all repos
        var query = `SELECT Repository.* FROM Repository`
        connection.query(query, function (err, rows, fields) {
            if (err) throw err
            res.status(200)
            res.send(rows)
        })
    }
});

app.get('/following/repository', function (req, res) {
    var user_name = req.query.user_name
    var query = `SELECT Repository.* FROM FollowsRepository INNER JOIN Repository ON Repository.name = FollowsRepository.repository_name WHERE FollowsRepository.follower='${user_name}'`
    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
});

// Post
app.post('/create/issue', function (req, res) {
    var user_name = req.body.follower;
    var repository_name = req.body.repository_name;
    var issue_body = req.body.repository_name;
    if (!issue_body) {
        issue_body = ""
    }
    // TODO:

    res.send("Not implemented")
});

app.post('/create/comment', (req, res) => (
    res.send("create comment")
))

app.post('/create/reaction', (req, res) => (
    res.send("create reaction")
))

app.post('/create/comment', (req, res) => (
    res.send("create comment")
))

app.post('/follow/user', function (req, res) {
    // stored procedure to avoid following someone we already follow?
    var follower = req.body.follower;
    var followee = req.body.followee;
    query = `
        INSERT INTO FollowsUser (follower, followee)
        VALUES ('${follower}', '${followee}')
        `

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(`${follower} followed ${followee}`)
    })
});

app.post('/follow/repo', function (req, res) {
    // stored procedure to avoid following a repo we already follow?
    var follower = req.body.follower;
    var repository_name = req.body.repository_name;
    query = `
    INSERT INTO FollowsRepository (follower, repository_name)
    VALUES ('${follower}', '${repository_name}')
    `

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(`${follower} followed ${repository_name}`)
    })
});

// Delete 

app.delete('/unfollow/user', function (req, res) {
    // stored procedure to avoid unfollowing someone we don't followed?
    var follower = req.body.follower;
    var followee = req.body.followee;
    query = `
    DELETE FROM FollowsUser
    WHERE follower = '${follower}'
    AND followee = '${followee}'
    `

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(`${follower} unfollowed ${followee}`)
    })
});

app.delete('/unfollow/repo', function (req, res) {
    // stored procedure to avoid unfollowing a repo we don't followed?
    var follower = req.body.follower;
    var repository_name = req.body.repository_name;
    query = `
    DELETE FROM FollowsRepository
    WHERE follower = '${follower}'
    AND repository_name = '${repository_name}'
    `

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(`${follower} unfollowed ${repository_name}`)
    })
});

app.post('/login', function (req, res) {
    const user_name = req.body.user;
    const password = req.body.password;

    connection.query(`SELECT * from User where username='${user_name}' and password='${password}'`, function (err, rows, fields) {
        if (err) throw err
        if (rows.length != 1) {
            res.status(401);
            res.send('Auth error.');
        } else {
            var query2 = `UPDATE User SET last_login_time =${Date.now()} where username='${user_name}'`
            connection.query(query2, function (err2, rows2, fields2) {
                if (err2) throw err2

            })

            res.status(200)
            res.send(rows[0])
        }
    })
});




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))