const express = require('express');

const app = express();

app.get('/index', function(req, res){
    res.render("views/index.html");
});

app.get('/about', function(req, res){
    res.send(`
        This is about our project <br>
        Our project is Survey System <br>
        Our team is Team Dúi
    `);
});

app.listen(3000, function(){
    console.log('server started at port 3000');
});
