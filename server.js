const express = require('express');
const app = express();

// set template engine: ejs
app.set('view engine', 'ejs');

// use public path
app.use('/public',express.static('public'));

// use urlencode
app.use(express.urlencoded({
    extended: true
}));

// use json
app.use(express.json());

// register routers
app.get('/', function(req, res){
    res.render('app');
});

app.use('/user', require('./routes/AuthRouters'));

app.listen(3000, function(){
    console.log('server started at port 3000');
});