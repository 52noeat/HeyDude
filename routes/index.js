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
router.get('/userList', (req, res) => {
    res.render('../views/userList.ejs');
});
router.get('/userAdd', (req, res) => {
    res.render('../views/userAdd.ejs');
});
router.get('/mypage', (req, res) => {
    res.render('../views/mypage.ejs');
});
router.get('/myProfile', (req, res) => {
    res.render('../views/myProfile.ejs');
});

module.exports = router;
