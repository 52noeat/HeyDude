const express = require('express');
const session = require('express-session');
const router = express.Router();


// Main Page
router.get('/', (req, res) => {
    res.render('../views/index.ejs');
});
router.get('/signin', (req, res) => {
    res.render('../views/signin.ejs');
});
router.get('/signup', (req, res) => {
    res.render('../views/signup.ejs');
});

router.get('/verification',(req,res)=>{
    let sess = req.session
    console.log({userID:sess.userID, verification : sess.verification})
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/verification.ejs');
    // }
});

router.get('/profileSet', (req, res) => {
    let sess = req.session
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/profileSet.ejs');
    // }
});
router.get('/userList', (req, res) => {
    let sess = req.session
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/userList.ejs');
    // }
});
router.get('/userAdd', (req, res) => {
    let sess = req.session
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/userAdd.ejs');
    // }
});
router.get('/chatList', (req, res) => {
    let sess = req.session
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/chatList.ejs');
    // }
});
router.get('/mypage', (req, res) => {
    let sess = req.session
    if(!sess.userID){
        res.render('../views/signin.ejs');
    }else{
        res.render('../views/mypage.ejs');
    }
});
router.get('/myProfile', (req, res) => {
    let sess = req.session
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/myProfile.ejs');
    // }
});

module.exports = router;
