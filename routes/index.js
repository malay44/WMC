const router = require('express').Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword;
const connection = require('../config/database');
const User = connection.models.User;
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
const path = require('path')

/**
 * -------------- POST ROUTES ----------------
 */

router.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }));




router.post('/register', (req, res, next) => {
    const saltHash = genPassword(req.body.pw);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    
    const newUser = new User({
        username: req.body.uname,
        hash: hash,
        salt: salt,
        admin: false
    });
    
    newUser.save()
    .then((user) => {
        console.log(user);
    });
    
    res.redirect('/');
});


/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
    res.sendFile(path.join( __dirname, "..", "Public/index.html"));
});


// router.get('/login', (req, res, next) => {

//     res.sendFile(path.join( __dirname, "..", "Public/index.html"));
// })

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

// When you visit http://localhost:3000/register, you will see "Register Page"
// router.get('/register', (req, res, next) => {

//     const form = '<h1>Register Page</h1><form method="post" action="register">\
//                     Enter Username:<br><input type="text" name="uname">\
//                     <br>Enter Password:<br><input type="password" name="pw">\
//                     <br><br><input type="submit" value="Submit"></form>';

//     res.send(form);
    
// });

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 * 
 * Also, look up what behaviour express session has without a maxage set
 */
router.get('/protected-route', isAuth, (req, res, next) => {
    res.send('You made it to the route.');
});

router.get('/admin-route', isAdmin, (req, res, next) => {
    res.send('You made it to the admin route.');
});

// Visiting this route logs the user out
router.get('/logout', (req, res, next) =>{

    req.session.destroy(function () {
        console.log("destroy----------------------------------------------------------------------");
        res.clearCookie("connect.sid");
        res.redirect("/");
    // req.logout(function(err) {
    //     if (err) { 
    //         return next(err) 
    //     }
    //     res.redirect('/login');
    });
});



router.get('/login-success', (req, res, next) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
    res.send('You entered the wrong password.');
});

module.exports = router;