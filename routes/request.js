const express = require('express');
const router = express.Router();
// Load User model
const {User, Profile, FriendList, Request, Chat}=require('../models/index');

router.get('/view',(req,res)=>{
    let userID = req.session.userID;
    Request.find({friendID: userID})
        .then(list=>{
            res.render("../views/userAdd.ejs",{request : list})
        })
})

router.post('/send',(req,res)=>{
    let {friendID} = req.body;
    const NewRequest = new Request({
        userID : req.session.userID,
        userName : req.session.userName,
        friendID : friendID
    })
    NewRequest.save()
        .then(result=>{
            res.send(true)
        })
})

router.post('/accept',(req,res)=>{
    // chat.save()
    //     .then(result=>{
    //         res.send(result)
    //         Request.findOne({userID : userID, friendID : friendID })
    //             .then(request=>{
    //                 if(request){
    //                     request.remove()
    //                 }
    //                 res.send(true)
    //             })
    //             .catch(err=>{
    //                 console.log(err);
    //             })
    //     })
    //     .catch(err=>console.log(err))
})

router.delete('/decline',(req,res)=>{
    let {userID} = req.body;
    let friendID = req.session.userID;

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

module.exports = router;
