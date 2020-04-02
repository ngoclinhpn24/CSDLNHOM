const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// set template engine: ejs
app.set('view engine', 'ejs');

// use public path
app.use('/public',express.static('public'));
app.use('/', cookieParser());

// use urlencode
app.use(express.urlencoded({
    extended: true
}));

// use json
app.use(express.json());

// register routers
app.use('/user', require('./routes/AuthRouters'));
app.use('/survey', require('./routes/SurveyRouters'));

app.listen(3000, function(){
    console.log('server started at port 3000');
});