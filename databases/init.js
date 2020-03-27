const mysql = require('mysql2');

// Initialization
let db = mysql.createConnection({
    host: 'localhost',
    user: 'team_dui_admin',
    password: 'Berserk 2018',
    database: 'team_dui' 
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