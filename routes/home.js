const express = require('express');
const router = express.Router();
// Load User model
const {User, Profile, FriendList, Request, Chat}=require('../models/index');

router.get('/',(req,res)=>{
    Profile.find()
        .then((list)=>{
            res.send({list:list})
        })
        .catch(err=>{console.log(err)})
})

router.get('/view',(req,res)=>{
    let friendID = req.body;
    Profile.findOne({userID: friendID})
        .then(thisProfile=>{
            if(thisProfile){
                res.send({profile: thisProfile})
            }
        }).catch(err=>{
            console.log(err)
    })
})

router.post('/request',(req,res)=>{
    let {request} = req.body;
    let newRequest = new Request(request)
    newRequest.save()
        .then(result=>{
            res.send(result);
        })
        .catch(err=>{console.log(err)})
})
