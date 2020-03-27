const express = require('express');
const app = express();

// include models
const User = require('./models/User');

// set template engine: ejs
app.set('view engine', 'ejs');


// register routes

app.get('/', function(req, res){
    res.render('app.ejs');
})

app.get('/test_model', async function(req, res){

    let user = await User.find(11);
    await user.delete();
    

    res.send('ok');
});


app.listen(3000, function(){
    console.log('server started at port 3000');
});