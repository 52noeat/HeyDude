const express = require('express');
const router = express.Router();
const session = require('express-session');
const {User, Profile, FriendList, Request, Chat, ChatRoom}=require('../models/index');

let this_chatCode = ""
let this_friendName = "";
let this_chatRoom = [];

router.get('/enter',(req, res)=>{
    let user_ID = req.session.userID;
    let user_Name = req.session.userName;
    Chat.find({chatCode : this_chatCode}).then(chat=> {
        if(chat.length>1) {
            res.render('../views/chat.ejs', {
                chatCode : this_chatCode, chat: chat,
                userID: user_ID, userName: user_Name,
                friendName : this_friendName});
        }else {
            res.render('../views/chat.ejs', {
                chatCode : this_chatCode ,chat: "",
                userID: user_ID, userName: user_Name,
                friendName : this_friendName});
        }
    });
})

router.get('/chatRoom',(req, res)=>{
    let user_ID = req.session.userID;
    let user_Name = req.session.userName;
    ChatRoom.find({userID : user_ID})
        .then(chatRoom=>{
            if(chatRoom){
                for(i in chatRoom){
                    for(j in chatRoom[i].userID){
                        if(chatRoom[i].userID[j]==user_ID){
                            chatRoom[i].userID.splice(j,1);
                            chatRoom[i].userName.splice(j,1);
                        }
                    }
                }
                res.render('../views/chatList.ejs',{chatRoom : chatRoom})
            }
            else{
                res.render('../views/chatList.ejs',{chatRoom : ""})
            }
        })
})

router.post('/roomSet',(req,res)=>{
    this_chatCode = req.body.chatCode;
    this_friendName = req.body.friendName;
    ChatRoom.findOne({chatCode: this_chatCode})
        .then(chatRoom=>{
            if(chatRoom){
                res.send(true);
            }
            else{
                res.send(false);
            }
        })

})

module.exports = router;
