const express = require('express');
const session = require('express-session');
const router = express.Router();

const {Request, Chat, ChatRoom}=require('../models/index');
let requestcount=0;
let messagecount=0;
let user_ID = "";

function send_check(){
    let count=0;
    Request.find({friendID :user_ID}, function (err, requestList) {
        if(requestList) {
            requestcount = requestList.length;
        }
    });
    ChatRoom.find({userID : user_ID})
        .then(chatRoom=>{
            if(chatRoom){
                for(i in chatRoom){
                    messagecount=+chatRoom[i].read;
                }
            }
            else{
                return
            }
        })
}

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

router.get('/profileSet', async (req, res) => {
    user_ID = req.session.userID
    await send_check()
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/setProfile.ejs',{messagecount: messagecount, requestcount : requestcount});
    // }
});

router.get('/chatList', async (req, res) => {
    user_ID = req.session.userID
    await send_check()
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/chatList.ejs',{messagecount: messagecount, requestcount : requestcount});
    // }
});

router.get('/mypage', async (req, res) => {
    user_ID = req.session.userID
    await send_check()
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        res.render('../views/mypage.ejs',{messagecount: messagecount, requestcount : requestcount});
    // }
});
router.get('/setProfile', async (req, res) => {
    user_ID = req.session.userID
    var sex = req.session.sex
    await send_check()
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    res.render('../views/setProfile.ejs',{user : user_ID, sex : sex, messagecount: messagecount, requestcount : requestcount});
    // }
});

router.get('/chat', async (req, res) => {
    user_ID = req.session.userID
    await send_check()
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    res.render('../views/chat.ejs',{messagecount: messagecount, requestcount : requestcount});
    // }
});


module.exports = router;
