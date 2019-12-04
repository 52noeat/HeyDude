const express = require('express');
const router = express.Router();
const session = require('express-session');
const {User, Profile, FriendList, Request, Chat, ChatRoom}=require('../models/index');

let this_chatCode = "1234"
let this_friendName = "";

router.get('/enter',(req, res)=>{
    let user_ID = req.session.userID;
    let user_Name = req.session.userName;
    Chat.find({chatCode : this_chatCode}).then(chat=> {
        if(chat.length>1) {
            res.render('../views/chat.ejs', {
                chatCode : this_chatCode,chat: chat,
                userID: user_ID, userName: user_Name});
        }else {
            res.render('../views/chat.ejs', {
                chatCode : this_chatCode ,chat: "",
                userID: user_ID, userName: user_Name});
        }
    });
})

router.get('chatRoom',(req, res)=>{
    let user_ID = req.session.userID;
    let user_Name = req.session.userName;
    ChatRoom.find({userID : user_ID})
        .then(chatRoom=>{
            console.log(chatRoom)
        })
})

module.exports = router;
