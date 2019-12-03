const express = require('express');
const router = express.Router();
const session = require('express-session');
const {User, Profile, FriendList, Request, Chat}=require('../models/index');


let this_nationality;
let this_tendency;
let this_language;
let this_level;
let this_interest;
let this_hate;
let this_wish;
let this_introduce;
let this_friendID;

router.post('/set', (req, res) => {
    const {
        age, nationality, major, tendency, language, level,
        interest, hate, wish, introduce } = req.body;
    let userID = req.session.userID;
    let userName = req.session.userName;
    let sex = req.session.sex;
    console.log(req.session)
    console.log(req.body)
    const newProfile = new Profile({
        userID: userID,
        userName: userName,
        age: age,
        sex: sex,
        major: major,
        nationality: nationality,
        tendency: tendency,
        language: language,
        level: level,
        interest: interest,
        hate: hate,
        wish: wish,
        introduce: introduce
    });
    Profile.findOne({userID:userID}).then(profile=>{
        if(profile){
            Profile.findOneAndUpdate({
                age: age,
                nationality: nationality,
                tendency: tendency,
                language: language,
                level: level,
                interest: interest,
                hate: hate,
                wish: wish,
                introduce: introduce
            })
                .then(()=>{
                    console.log(userID + '회원 정보가 수정되었습니다.');
                    res.send(true)
                }).catch(err=>res.send(false));
        }
        else{
            newProfile
                .save()
                .then(profile => {
                    console.log(userID + '회원 정보가 등록되었습니다.');
                    res.send(true);
                })
                .catch(
                    err =>res.send(false));
        }
    })
});

router.post('/detail', (req,res)=>{
    let {friendID} = req.body;
    this_friendID = friendID;
    Profile.findOne({userID:friendID}).then(profile=>{
        if(profile){
            console.log(profile)
            res.send(true);
        }else{
            res.send(false)
        }
    })
});

router.get('/view', (req,res)=>{
    Profile.findOne({userID:this_friendID}).then(profile=>{
        if(profile){
            console.log(profile)
            res.render('../views/profile.ejs', {profile : profile});
        }else{
            res.render('../views/profile.ejs', {profile : ""});
        }
    })
})

router.get('/myProfile', (req, res) => {
    let userID = req.session.userID;
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    Profile.findOne({userID:userID}).then(profile=>{
        if(profile){
            console.log(profile)
            res.render('../views/myProfile.ejs',{profile : profile});
        }else{
            res.render('../views/setProfile.ejs');
        }
    })
    // }
});

router.get('/community',(req,res)=>{
    let user_ID = req.session.userID;
    Profile.find().then(profile=> {
        if(profile.length>1) {
            for(i in profile){
                if(profile[i].userID==user_ID){
                    profile.splice(i,1)
                }
            }
            res.render('../views/community.ejs', {profile: profile});
        }else {
            res.render('../views/community.ejs', {profile: ""});
        }
    });
});

router.get('/edit', (req, res) => {
    let userID = req.session.userID;
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    Profile.findOne({userID:userID}).then(profile=>{
        if(profile){
            res.render('../views/editProfile.ejs',{profile : profile});
        }else{
            res.render('../views/setProfile.ejs');
        }
    })
    // }
});

module.exports = router;
