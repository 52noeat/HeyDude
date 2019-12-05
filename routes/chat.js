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
    Chat.updateMany({chatCode : this_chatCode},{read :true})
        .then(()=>{
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
})

router.get('/chatRoom', async(req, res)=>{
    let user_ID = req.session.userID;
    let user_Name = req.session.userName;
    let message = [];
    let date = [];
    let read = [];
    await ChatRoom.find({userID : user_ID})
        .then(chatRoom=>{
            if(chatRoom){
                for(i in chatRoom){
                    for(j in chatRoom[i].userID){
                        if(chatRoom[i].userID[j]==user_ID){
                            chatRoom[i].userID.splice(j,1);
                            chatRoom[i].userName.splice(j,1);
                        }
                    }
                    Chat.find({chatCode: chatRoom[i].chatCode})
                        .then(chat=>{
                            if(chat.length>0){
                                let count=0;
                                for(j in chat) {
                                    if (chat[j].read == false&&chat[j].userID != user_ID){
                                            count++;
                                    }
                                }
                                let end= chat.length-1;
                                message.push(chat[end].message);
                                date.push(chat[end].date);
                                read.push(count);
                                if(i==chatRoom.length-1){
                                    console.log(message,date,read)
                                    res.render('../views/chatList.ejs',{chatRoom : chatRoom, message: message, date: date, read : read})
                                }
                            }
                            else{
                                res.render('../views/chatList.ejs',{chatRoom : chatRoom, message: message, date: date, read : read})
                            }
                        })
                }
            }
            else{
                res.render('../views/chatList.ejs',{chatRoom : "", message: message, date: date, read : read})
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
