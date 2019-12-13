const express = require('express');
const router = express.Router();
const session = require('express-session');
const {User, Profile, FriendList, Request, Chat, ChatRoom}=require('../models/index');

let this_chatCode = ""
let this_friendName = "";
let this_url = "";
let this_friendurl = "";
let this_chatRoom = [];
let requestcount=0;
let messagecount=0;
let user_ID = "";

function send_check(){
    requestcount=0;
    messagecount=0;
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

router.get('/enter',(req, res)=>{
    user_ID = req.session.userID;
    send_check()
    let user_Name = req.session.userName;

    Chat.updateMany({chatCode : this_chatCode},{read :true})
        .then(()=>{
            ChatRoom.findOneAndUpdate({chatCode : this_chatCode},{read :0})
                .then(()=>{
                    Chat.find({chatCode : this_chatCode}).then(chat=> {
                        if(chat.length>1) {
                            res.render('../views/chat.ejs', {
                                chatCode : this_chatCode, chat: chat,
                                userID: user_ID, userName: user_Name,
                                url: this_url, friendurl : this_friendurl,
                                friendName : this_friendName,
                                messagecount: messagecount, requestcount : requestcount});
                        }else {
                            res.render('../views/chat.ejs', {
                                chatCode : this_chatCode ,chat: "",
                                userID: user_ID, userName: user_Name,
                                url: this_url, friendurl : this_friendurl,
                                friendName : this_friendName,
                                messagecount: messagecount, requestcount : requestcount});
                        }
                    });
                })
        })
})

router.get('/chatRoom', (req, res)=>{
    user_ID = req.session.userID;
    let message = [];
    let date = [];
    let read = [];
    ChatRoom.find({userID : user_ID})
        .then(chatRoom=>{
            if(chatRoom){
                for(i in chatRoom){
                    for(j in chatRoom[i].userID){
                        if(chatRoom[i].userID[j]==user_ID){
                            chatRoom[i].userID.splice(j,1);
                            chatRoom[i].userName.splice(j,1);
                            chatRoom[i].url.splice(j,1);
                        }
                    }

                }
                res.render('../views/chatList.ejs',{chatRoom : chatRoom, messagecount: messagecount, requestcount : requestcount})
            }
            else{
                res.render('../views/chatList.ejs',{chatRoom : "", message: message, date: date, read : read, messagecount: messagecount, requestcount : requestcount})
            }
        })
})

router.post('/roomSet',(req,res)=>{
    let userID = req.session.userID;
    this_chatCode = req.body.chatCode;
    this_friendName = req.body.friendName;
    ChatRoom.findOne({chatCode: this_chatCode})
        .then(chatRoom=>{
            if(chatRoom){
                if(chatRoom.userID[0]==userID){
                    this_url=chatRoom.url[0]
                    this_friendurl =chatRoom.url[1]
                }else{
                    this_url=chatRoom.url[1]
                    this_friendurl =chatRoom.url[0]
                }
                res.send(true);
            }
            else{
                res.send(false);
            }
        })

})

module.exports = router;
