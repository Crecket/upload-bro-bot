var express = require('express')
var session = require('express-session')
var app = express()

// view renderer setup
app.set('views', __dirname + '/Views');
app.set('view engine', 'twig');

app.disable('view cache');

// session middleware
app.use(session({
    name: "SESS_ID",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}))

// serve static files
app.use(express.static(__dirname + '/../public'));

// routes
app.get('/', function (req, res) {
    req.session.views = (!req.session.views) ? 1 : req.session.views + 1;
    res.render('index', {views: req.session.views})
})
app.get('/oauth_callback', function (req, res) {
    req.session.views = (!req.session.views) ? 1 : req.session.views + 1;
    res.render('index', {views: req.session.views})
})

// start listening
app.listen(80, function () {
    console.log('Express app listening on port 80!')
})

module.exporst = app;