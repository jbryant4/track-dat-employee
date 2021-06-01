const mysql = require('mysql2');

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        //Your MySQL username
        user: 'root',
        //Your MySQL password
        password: 'JoKing614!',
        database: 'joe_is_boss'
    },
    console.log('Connected to the joe_is_boss database')
);

module.exports = db;