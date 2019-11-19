const express = require('express');
const router = express.Router();

// Main Page
router.get('/', (req, res) => {
    res.render('../views/home.ejs');
});
router.get('/signin', (req, res) => {
    res.render('../views/signin.ejs');
});
router.get('/signup', (req, res) => {
    res.render('../views/signup.ejs');
});
router.get('/profileSet', (req, res) => {
    res.render('../views/profileSet.ejs');
});

router.get('/UserList', (req, res) => {
    res.render('../views/UserList.ejs');
});

module.exports = router;
