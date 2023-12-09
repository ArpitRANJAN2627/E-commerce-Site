 const express = require('express')
const app = express();
const mongoose=require('mongoose');
const path=require('path');
const methodOverride = require('method-override');
const productRoutes=require('./routes/productRoutes')
const reviewRoutes=require('./routes/reviewRoutes')
const authRoutes=require('./routes/authRoutes')
const ejsMate=require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const cartRoutes=require('./routes/cartRoutes');
const flash=require('connect-flash');
const session = require('express-session');
const exp = require('constants');



mongoose.connect('mongodb://127.0.0.1:27017/ShoppingApp')
 .then(()=>{console.log('DB Connected')})
 .catch((err)=>{
    console.log(err);
 })


 app.engine('ejs', ejsMate);
 app.set('view engine', 'ejs');
 app.set('views', path.join(__dirname, 'views'));
 app.use(express.urlencoded({ extended: true }));
 app.use(methodOverride('_method'))
 app.use(express.static(path.join(__dirname,'public')))


 const sessionConfig = {
  secret: 'weneedabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure: true
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 1,
    maxAge:1000 * 60 * 60 * 24 * 7 * 1
  }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.authenticate('session'));
 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentUser = req.user;
  next();
});

 app.get('/',(req,res)=>{
  res.render('home');
 })
 
 app.use(productRoutes);
 app.use(reviewRoutes);
 app.use(authRoutes);
 app.use(cartRoutes);
 
 app.listen(3000,()=>{
   console.log('server started at port 3000');
 });