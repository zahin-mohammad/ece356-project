const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser');
var async = require("async");
var SqlString = require('sqlstring');




//////////////////////////////////////////////////////////////////////
// Database Setup
//////////////////////////////////////////////////////////////////////

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3308',
    user: 'express',
    password: 'password',
    database: 'github'
})

function connect() {
    return new Promise((resolve, reject) => {
        connection = mysql.createConnection({
            host: 'localhost',
            port: '3308',
            user: 'express',
            password: 'password',
            database: 'github'
        })

        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                reject(err);
                return;
            }
            resolve('connected as id ' + connection.threadId);
        })
    });
}

function establishConnection() {
    var a = connect();
    a.then(a => console.log("Database connection: success"))
        .catch(err => {
            console.error(err);
            console.error("Database connection: retrying");
            setTimeout(establishConnection, 2000);
        });
};

establishConnection();

//////////////////////////////////////////////////////////////////////
// Express Setup
//////////////////////////////////////////////////////////////////////
const app = express()
const port = 3001

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.on('uncaughtException', function (req, res, route, err) {
    log.info('******* Begin Error *******\n%s\n*******\n%s\n******* End Error *******', route, err.stack);
    if (!res.headersSent) {
        return res.send(500, { ok: false });
    }
    res.write('\n');
    res.end();
});

//////////////////////////////////////////////////////////////////////
// Endpoints
//////////////////////////////////////////////////////////////////////

// Test
app.get('/', function (req, res) {
    res.send("Hello World!")
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

app.get('/comments', function (req, res) {
    var post_id = req.query.post_id;

    var query = `
    SELECT * From Comment
    WHERE post_id='${post_id}'
    ORDER BY created_at ASC
    `
    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
});

app.get('/post/replies', function (req, res) {
    var post_id = req.query.post_id;

    var query = `
        SELECT * 
        From Reply
        INNER JOIN Comment
        On Comment.id = Reply.reply_id
        WHERE Comment.post_id = '${post_id}'
        `
    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
});

app.get('/comments/reactions', function (req, res) {
    var comment_id = req.query.comment_id;

    query = `SELECT * FROM Reaction WHERE comment_id='${comment_id}'`

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
})

app.get('/post/reactions', function (req, res) {
    var post_id = req.query.post_id;

    query = `
        SELECT count(*) AS 'count', emoji, comment_id
        FROM Reaction 
        INNER JOIN Comment 
        ON Reaction.comment_id = Comment.id
        INNER JOIN Post
        ON Comment.post_id = Post.id
        WHERE Post.id=${post_id}
        GROUP BY emoji, comment_id`

    connection.query(query, function (err, rows, fields) {
        if (err) throw err
        res.status(200)
        res.send(rows)
    })
})

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

app.get('/repository/posts', function (req, res) {
    var repository_name = req.query.repository_name

    if (repository_name) { // get all repo's that user_name doesn't follow
        var query = `
        SELECT Post.* 
        FROM Post
        INNER JOIN Repository
        ON Post.repository_name = Repository.name
        WHERE Repository.name = '${repository_name}'
        `;

        connection.query(query, function (err, rows, fields) {
            if (err) throw err
            res.status(200)
            res.send(rows)
        })

    } else {
        if (err) throw err
        res.status(400)
        res.send("No repository name provided")
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

// POST Requests

app.post('/create/repository', function (req, res) {

    var user_name = req.body.user_name;
    var repository_name = req.body.repository_name;
    var description = req.body.description;
    if (user_name == "" || repository_name == "") {
        res.status(400).jsonp(`Invalid user_name ${user_name} or invalid repository_name ${repository_name}`);
        return
    }
    var created_at = Date.now()
    var updated_at = Date.now()

    // TODO: follow the repo
    async.series([
        function (callback) {
            query = `
            INSERT INTO Repository (name, description, username, created_at, updated_at)
            VALUES('${repository_name}', '${description}', '${user_name}', ${created_at}, ${updated_at})
            `
            connection.query(query, function (err, rows, fields) {
                if (err) {
                    throw err
                } else {
                    res.status(200)
                    res.send(`${user_name} created ${repository_name}`)
                    callback();
                }
            })
        },
        function (callback) {
            query = `
            INSERT INTO FollowsRepository(follower, repository_name)
            VALUES('${user_name}','${repository_name}')
            `
            connection.query(query, function (err, rows, fields) {
                if (err) throw err
                callback();
            })

        }
    ])


});

app.post('/create/post', function (req, res) {
    var post_id = Math.round(Math.random() * 10000000)
    var user_name = req.body.user_name;
    var repository_name = req.body.repository_name;
    var title = req.body.title;
    var post_body = req.body.post_body;
    var created_at = Date.now()
    var updated_at = Date.now()
    console.log(created_at);

    if (title == "") {
        res.status(400)
        res.send(`Invalid title ${title}`)
        return
    }

    async.series([
        function (callback) {
            query = `
            INSERT INTO Post (id, repository_name, title, username, created_at, updated_at)
            VALUES (${post_id}, '${repository_name}', ${SqlString.escape(title)}, '${user_name}', ${created_at}, ${updated_at})
            `
            connection.query(query, function (err, rows, fields) {
                if (err) throw err
                callback()
            })
        },
        function (callback) { // TODO: Make this a function, being called twice?
            var id = Math.round(Math.random() * 10000000)
            query = `
                INSERT INTO Comment (id, post_id, username, body, created_at, updated_at)
                VALUES (${id}, ${post_id}, '${user_name}', ${SqlString.escape(post_body)}, ${created_at}, ${updated_at})
                `

            connection.query(query, function (err, rows, fields) {
                if (err) throw err
                res.status(200)
                res.send(`${user_name} created a post`)
                callback()
            })
        },
    ])
});

app.post('/create/comment', function (req, res) {
    var user_name = req.body.user_name;
    var id = Math.round(Math.random() * 10000000)
    var post_id = req.body.post_id;
    var comment_body = req.body.comment_body;
    var replying_to = req.body.replying_to
    var created_at = Date.now()
    var updated_at = Date.now()

    async.series([
        function (callback) {
            var query = `
                INSERT INTO Comment (id, post_id, username, body, created_at, updated_at)
                VALUES (${id}, ${post_id}, '${user_name}', ${SqlString.escape(comment_body)}, ${created_at}, ${updated_at})
                `

            connection.query(query, function (err, rows, fields) {
                if (err) throw err
                res.status(200)
                res.send(`${user_name} created a comment`)
                callback();
            })
        },
        function (callback) {
            if (replying_to != "") {
                var query = `
                    INSERT INTO Reply (comment_id, reply_id)
                    VALUES (${replying_to}, ${id})
                    `;

            }
            connection.query(query, function (err, rows, fields) {
                callback();
            })
        }
    ]);
});

app.post('/create/reaction', function (req, res) {
    var user_name = req.body.user_name;
    var comment_id = req.body.comment_id;
    var reaction = req.body.reaction;



    var shouldLike = false
    async.series([
        function (callback) {
            var query = `
                SELECT * 
                FROM Reaction 
                WHERE emoji='${reaction}'
                AND username ='${user_name}'
                AND comment_id = '${comment_id}'
                `

            connection.query(query, function (err, rows, fields) {
                if (rows.length == 0) {
                    shouldLike = true
                }
                callback();
            })
        },
        function (callback) {
            var query = (shouldLike ?
                `
                INSERT INTO Reaction (comment_id, emoji, username)
                VALUES (${comment_id}, '${reaction}', '${user_name}')
                `
                :
                `
                DELETE FROM Reaction
                WHERE comment_id = '${comment_id}'
                AND emoji = '${reaction}'
                AND username = '${user_name}'
                `);

            connection.query(query, function (err, rows, fields) {
                if (err) throw err;
                res.status(200)
                res.send(`${user_name} ${shouldLike ? "reacted" : "unreacted"} ${reaction}`)
                callback();
            })
        }
    ]);
})

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

// DELETE Requests

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

    async.series([
        function (callback) {
            var query = `SELECT * from User where username='${user_name}' and password='${password}'`
            console.log(`Logging in ${user_name}`)
            connection.query(query, function (err, rows, fields) {
                if (err) throw err
                if (rows.length != 1) {
                    res.status(401);
                    res.send('Auth error.');
                } else {
                    res.status(200)
                    res.send(rows[0])
                }
                callback();
            })
        },
        function (callback) {
            console.log(`Updating time to ${Date.now()}`)
            var query = `UPDATE User SET last_login_time=${Date.now()} WHERE username='${user_name}'`
            connection.query(query, function (err, rows, fields) {
                callback();
            })
        }
    ]);



});



app.listen(port, () => console.log(`Social Network Server listening at http://localhost:${port}`))