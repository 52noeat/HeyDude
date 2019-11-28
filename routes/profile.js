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

router.get('/myProfile', (req, res) => {
    let userID = req.session.userID;
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    console.log(userID)
    Profile.findOne({userID:userID}).then(profile=>{
        if(profile){
            console.log(profile)
            res.render('../views/myProfile.ejs',{profile : profile});
        }else{
            res.render('../views/myProfile.ejs');
        }
    })
    // }
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
            res.render('../views/editProfile.ejs');
        }
    })
    // }
});

module.exports = router;
