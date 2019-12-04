const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const ejs = require('ejs');
var logger = require('morgan');

// Passport Config
// app.use(logger('dev'));
// Connect to MongoDB
mongoose.Promise = global.Promise;

// CONNECT TO MONGODB SERVER
mongoose.connect('mongodb://15.164.7.246:27017/heydude', {
  authSource: "admin",
  useNewUrlParser:true,
  useUnifiedTopology:true
} ).then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use('/views',express.static('views'));
// EJS

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


// Express body parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(session({
  secret: '1@%24^%$3^*&98&^%$', // 쿠키에 저장할 connect.sid값을 암호화할 키값 입력
  resave: false,                //세션 아이디를 접속할때마다 새롭게 발급하지 않음
  saveUninitialized: false,      //세션 아이디를 실제 사용하기전에는 발급하지 않음
  cookie:{
    maxAge: 1000 * 60 * 60 * 24   //24시간 만기
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  next();
});


// Routes
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user.js'));
app.use('/home', require('./routes/home.js'));
app.use('/profile', require('./routes/profile.js'));
app.use('/request', require('./routes/request.js'));
app.use('/chat', require('./routes/chat.js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
module.exports = app;
