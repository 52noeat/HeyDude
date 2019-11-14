const express = require('express');
const router = express.Router();
// Load User model
const {User, Profile, FriendList, Request, Chat}=require('../models/index');

router.get('/',(req,res)=>{
    let userID = req.body;

    Request.find({friendID: userID})
        .then(list=>{
            res.send({requestList: list})
        })
})

router.post('/accept',(req,res)=>{
    const {newChat, userType} = req.body;
    const chat = new Chat(newChat)
    let userID,friendID;

    if(userType){
        userID = newChat.KID
        friendID = newChat.FID
    }else{
        userID = newChat.FID
        friendID = newChat.KID
    }
    chat.save()
        .then(result=>{
            res.send(result)
            Request.findOne({userID : userID, friendID : friendID })
                .then(request=>{
                    if(request){
                        request.remove()
                    }
                    res.send(true)
                })
                .catch(err=>{
                    console.log(err);
                })
        })
        .catch(err=>console.log(err))
})

router.delete('/decline',(req,res)=>{
    const {userID, friendID} = req.body;
    Request.findOne({userID : userID, friendID : friendID })
        .then(request=>{
            if(request){
                request.remove()
            }
            res.send(true)
        })
        .catch(err=>{
            console.log(err);
        })
})
