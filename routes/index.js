var express = require('express');
var router = express.Router();
const users=require('./users')
const passport=require('passport')
const localStrategy=require('passport-local');
const { route } = require('../app');
passport.use(new localStrategy(users.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/register',(req,res)=>{
  const {username,pic}=req.body
  const newuser={username,pic}

  users.register(newuser,req.body.password)
  .then((registeredUser)=>{
    passport.authenticate('local')(req,res,()=>{
      res.redirect('/login')
    })
  })
  .catch((error) => {
    // Handle registration errors
    console.error('Registration error:', error);
    res.send(error)
    res.status(500).send('An error occurred during registration. Please try again.');
  });
})

router.get('/register',(req,res)=>{
  res.render('register.ejs')
})


router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',  // Redirect to profile on success
  failureRedirect: '/login',   // Redirect back to login on failure
  failureFlash: true           // Optional: enable error messages
}));

router.get('/login',(req,res)=>{
  res.render('login')
})

const isLoggedIn=(req,res,next)=>{
  if(req.isAuthenticated()) return next()
    else res.redirect('/login')
}

router.get('/profile',isLoggedIn,async (req, res) => {
  // if (req.isAuthenticated()) {
  //   // Pass the user data to the profile.ejs template
  //   res.render('profile', { user: req.user });
  // } else {
  //   res.redirect('/login');
  // }

  const loggedIn=await users.findOne({username:req.session.passport.user})
  res.render('profile',{user:loggedIn})
});


router.get('/logout', (req, res, next) => {
 if(req.isAuthenticated()){
  req.logout((err)=>{
    if(err) res.send(err)
      else res.redirect('/')
  })
 }else{
  res.redirect('/')
 }
});

module.exports = router;
