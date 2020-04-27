const mysql = require('mysql2');

// Initialization
// let db = mysql.createConnection({
//     host: 'localhost',
//     user: 'team_dui_admin',
//     password: 'Berserk 2018',
//     database: 'team_dui' 
// });
let db = mysql.createConnection({
    host: 'db4free.net',
    user: 'team_dui_admin',
    password: '25112000',
    database: 'team_dui',
    port: '3306'
});

// Connect to database
db.connect(function(error){
    if(error){
        console.log('Error: ' + error.message);
    } else {
        console.log('Connected to Database');
    }
});

// Exports module db
module.exports = db;