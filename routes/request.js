const express = require('express');
const router = express.Router();
// Load User model
const {User, Profile, FriendList, Request, Chat, ChatRoom}=require('../models/index');
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
router.get('/view',(req,res)=>{
    user_ID = req.session.userID;
    send_check()
    Request.find({friendID: user_ID})
        .then(request=>{
            res.render("../views/request.ejs",{request : request, messagecount: messagecount, requestcount : requestcount})
        })
})

router.post('/send',(req,res)=>{
    let {friendID} = req.body;
    let userID = req.session.userID;
    Profile.findOne({userID : userID})
        .then(profile=>{
            if(profile){
                const NewRequest = new Request({
                    userID : req.session.userID,
                    userName : req.session.userName,
                    friendID : friendID,
                    sex : profile.sex,
                    age : profile.age,
                    nationality : profile.nationality,
                    tendency : profile.tendency,
                    url : profile.url
                })
                NewRequest.save()
                    .then(result=>{
                        Profile.updateOne(
                            {userID : friendID},
                            {$push:{plus : userID}})
                            .then(result=>{
                                res.send(true)
                            })
                    })
            }else{
                res.send(false)
            }
        })
})

router.post('/minus',(req,res)=>{
    let {friendID} = req.body;
    let userID = req.session.userID;
    Request.deleteOne({userID : userID, friendID : friendID})
        .then(request=>{
            if(request){
                Profile.updateOne(
                    {userID : friendID},
                    {
                        $pull:{plus : userID}
                    })
                    .then(result=>{
                        res.send(true)
                    })
            }else{
                res.send(false)
            }
        })
})

router.post('/block',(req,res)=>{
    let {friendID} = req.body;
    let userID = req.session.userID;
    Profile.updateOne(
        {userID : friendID},
        {
            $push:{block : userID}
        })
        .then(result=>{
            res.send(true)
        })
})

router.post('/accept',(req,res)=>{
    let {friendID,friendName,friendurl} = req.body;
    const userID = req.session.userID
    let chatCode = userID+friendID;
    Profile.findOne({userID:userID})
        .then(profile=>{
            if(profile){
                const NewChatRoom = new ChatRoom({
                    chatCode : chatCode,
                    userID : [ userID, friendID],
                    userName : [ req.session.userName, friendName],
                    url : [profile.url, friendurl]
                })
                NewChatRoom.save()
                    .then(result=>{
                        res.send(result)
                        Request.findOne({userID : friendID, friendID : userID })
                            .then(request=>{
                                if(request){
                                    request.remove()
                                    Profile.updateOne(
                                        {userID : friendID},
                                        {
                                            $push:{friend : userID}
                                        })
                                        .then(result=>{
                                            Profile.updateOne(
                                                {userID : userID},
                                                {
                                                    $push : {friend : friendID},
                                                    $pull : {plus : friendID}
                                                })
                                                .then(result=>{
                                                    res.send(true)
                                                })
                                        })
                                }
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                    })
                    .catch(err=>console.log(err))
            }
        })
})

router.post('/decline',(req,res)=>{
    let {friendID} = req.body;
    const userID = req.session.userID
    Request.findOne({userID : friendID, friendID : userID })
        .then(request=>{
            if(request){
                request.remove()
                Profile.updateOne(
                    {userID : userID},
                    {
                        $push: {block : friendID},
                        $pull: {plus : friendID}
                    })
                    .then(result=>{
                        res.send(true)
                    })
            }
        })
        .catch(err=>{
            console.log(err);
        })
})

router.post('/disconnect',(req,res)=>{
    let {friendID,chatCode} = req.body;
    let userID = req.session.userID;
    ChatRoom.updateOne(
        {chatCode : chatCode},
        {
            exit : true
        })
        .then(result=>{
            if(result){
                Profile.findOneAndUpdate({userID:userID},
                    {
                    $push: {block : friendID},
                    $pull: {plus : friendID}
                    })
                    .then(result=>{
                        Profile.findOneAndUpdate({userID:friendID},
                            {
                                $pull: {friend : userID}
                            })
                            .then(result=>{
                                res.send(true)
                            })
                    })
            }else{
                res.send(false)
            }
        })
})

module.exports = router;
