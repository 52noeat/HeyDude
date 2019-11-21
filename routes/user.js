const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// Load User model
const {User, Profile, FriendList, Request, Chat}=require('../models/index');

// Duplicate User
router.post('/duplicate', (req, res) => {
    var {userID} = req.body
    User.findOne({userID: userID}).then(user => {
        if (user)
            res.send(false)
        else
            res.send(true)
    });
})

// Register
router.post('/signup', (req, res) => {
    const {userID, password, userName, nickName, sex} = req.body;
    let code=0;
    for(let n=0; n < 6;n++){
            let num = Math.floor(Math.random() * 10);;
            code=code*10;
            code+= num;
    }
    code=code%1000000;

    let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'heydudeajou@gmail.com',
            pass: 'rnrkd9wh!@'
        }
    }));

    let mailOptions = {
        from: 'heydudeajou@gmail.com',
        to: userID+'@ajou.ac.kr',
        subject: 'Verification code for HeyDude sign up',
        text: 'your verification code is'+'\n'+code
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    const newUser = new User({
        userID: userID,
        password: password,
        userName: userName,
        nickName: nickName,
        sex: sex,
        verification : code
    });
    User.findOne({userID:userID}).then(ID=>{
      if(ID){
        res.send(false);
      }
      else{
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
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

// Signin
router.post('/signin', (req, res) => {
    let sess
    let {userID,password} = req.body;
        sess = req.session;
    console.log(req.body);
        User.findOne({
            userID: userID
        }).then(user => {
            if (!user) {
                res.send("1")
            }
            // Match password
            else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        sess.userID = user.userID;
                        sess.verification = user.verification;
                        if (user.verification != '1') {
                            res.send("3")
                        } else {
                            res.send("4");
                        }
                    } else {
                        res.send("2");
                    }
                });
            }
        });
});

// Verification
router.post('/verification', (req, res) => {
    let sess
    let {verification} = req.body;
    let userID;
    sess = req.session;
    userID = req.session.userID
    User.findOne({
        userID: userID
    }).then(user => {
        if (!user) {
            res.send("1")
        }else{
            if(user.verification==verification){
                User.updateOne({userID: userID}, {verification: '1'}).then(result=>{
                    res.send("3")
                })
            }else{
                res.send("2")
            }
        }
    });
});

// Signout
router.get('/signout', (req, res) => {
    sess = req.session
    req.session.destroy(function (err) {
        if(err){
            throw err
        }else{
            res.send('1');
        }
    })
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
