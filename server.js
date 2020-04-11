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

// register middlewares
app.use(require('./middlewares/AuthMiddleware').auth);

// register routers

app.use('/', require('./routes/HomeRouter'));
app.use('/user', require('./routes/AuthRouter'));
app.use('/survey', require('./routes/SurveyRouter'));
app.use('/question', require('./routes/QuestionRouter'));
app.use('/question', require('./routes/ReportRouter'));


app.listen(3000, function(){
    console.log('server started at port 3000');
});