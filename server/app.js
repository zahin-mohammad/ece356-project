const express = require('express')
const mysql = require('mysql')

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'express',
    password: 'password',
    database: 'social_network'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err

    console.log(rows[0].solution)
})

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))