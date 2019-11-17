const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportConfig = require('../config/passport');
const nodemailer = require('nodemailer');
// Load User model
const {User, Profile, FriendList, Request, Chat}=require('../models/index');

// Duplicate User
router.get('/duplicate/:userID', (req, res) => {
    var {userID} = req.params
    User.findOne({userID: userID}).then(user => {
        if (user)
            res.send(true)
        else
            res.send(false)
    });
})

// Register
router.post('/signup', (req, res) => {
  const { userType, userID, password, userName } = req.body;
    const newUser = new User({
        userType: userType,
        userID: userID,
        password: password,
        userName: userName
    });
    User.findOne({userID:userID}).then(ID=>{
      if(ID){
        res.send(false);
      }
      else{
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then(user => {
                  console.log(userID + '회원 등록되었습니다.');
                  res.send(true);
                })
                .catch(err => console.log(err));
          });
        });
      }
    })
});

// Profile
router.post('/profile', (req, res) => {
    const { userType, userID, userName, birth,
        nationality, language, goal, wish, introduce } = req.body;

    const newProfile = new User({
        userType: userType,
        userID: userID,
        userName: userName,
        birth: birth,
        nationality: nationality,
        language: language,
        goal: goal,
        wish: wish,
        introduce: introduce
    });
    Profile.findOne({userID:userID}).then(profile=>{
        if(profile){
            Profile.findOneAndUpdate({
                userType: userType,
                userID: userID,
                userName: userName,
                birth: birth,
                nationality: nationality,
                language: language,
                goal: goal,
                wish: wish,
                introduce: introduce
            })
                .then(()=>{
                    res.send(true)
                }).catch(err=>console.log(err));
        }
        else{
            newProfile
                .save()
                .then(profile => {
                    console.log(userID + '회원 정보가 등록되었습니다.');
                    res.send(true);
                })
                .catch(err => console.log(err));
        }
    })
});

passportConfig();

// Login
router.post('/login',
    passport.authenticate('local'),
    (req, res) => {
      let userType;
      if(req.user.userType == false)
          userType = false;
      else
          userType = true;
      if(req.user.userID=="admin")
          userType = 3;
      res.send({
            userType: userType,
            userName: req.user.userName,
            userID: req.user.userID
      });

});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.send("logout");
});

router.post('/passwordCheck',(req,res)=>{
  const { userID,password } = req.body;
  User.findOne({userID:userID}).then(ID=>{
    if(ID){
      bcrypt.compare(password, ID.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          res.send(true);
        } else {
          res.send(false)
        }
      })
    }else{res.send(false)}
  })
})

router.post('/edit', async (req,res)=> {
    let {userID, password} = req.body;
    let newPassword;


    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            newPassword = hash;
            User.findOneAndUpdate({userID: userID}, {password: newPassword})
                .then(ID => {
                    res.send(true)

                }).catch(err => console.log(err));
        });
    })
})

router.post('/withdraw',(req,res)=>{
  const {userID, userType} =req.body;
  User.findOne({userID:userID}).then(ID=>{
    if(ID){
        Profile.delete({userID: userID})
            .catch(err=>{
            console.log(err)
            })
        ID.remove()
        res.send(true)
    }else{res.send(false)}
  })
})

router.post('/disconnect',(req,res)=>{
    const {userID, userType, friendID} =req.body;

    FriendList.findOneAndUpdate({userID:userID}
        ,{$pull: {
                "friendList": {
                    userID: friendID}}}
    )
    if(userType==true) {
        Chat.findOneAndUpdate({KID:userID,FID:friendID},
            {exit: true})
    }
})

//autologin
router.get('/', (req,res)=>{
  let sessionCheck = false;
  if (typeof req !== 'undefined' && typeof req.user !== 'undefined') {
    sessionCheck = true
  }
  res.send(sessionCheck);
});

module.exports = router;
