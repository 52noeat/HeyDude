const express = require('express');
const router = express.Router();
const session = require('express-session');
const {User, Profile, FriendList, Request, Chat, ChatRoom}=require('../models/index');


let this_nationality;
let this_tendency;
let this_language;
let this_level;
let this_interest;
let this_hate;
let this_wish;
let this_introduce;
let this_friendID;
let requestcount=0;
let messagecount=0;
let user_ID = "";

function send_check(){
    count=0;
    Request.find({friendID :user_ID}, function (err, requestList) {
        if(requestList) {
            requestcount = requestList.length;
        }
    });
    ChatRoom.find({userID : user_ID})
        .then(chatRoom=>{
            if(chatRoom){
                for(i in chatRoom){
                    Chat.find({chatCode: chatRoom[i].chatCode})
                        .then(chat=>{
                            if(chat.length>0){
                                for(j in chat) {
                                    if (chat[j].read == false&&chat[j].userID != user_ID){
                                        count++;
                                    }
                                }
                                if(i==chatRoom.length-1){
                                    if(count!=messagecount)
                                        messagecount=count;
                                    return;
                                }
                            }
                            else{
                                return;
                            }
                        })
                }
            }
            else{
                return
            }
        })
}

router.post('/set', (req, res) => {
    const {
        age, nationality, major, tendency, language, level,
        religion, interest, hate, wish, introduce, url } = req.body;
    let userID = req.session.userID;
    let userName = req.session.userName;
    let sex = req.session.sex;
    console.log(url);

    Profile.findOne({userID:userID}).then(profile=>{
        if(profile){
            Profile.findOneAndUpdate({userID:userID},
                {
                age: age,
                nationality: nationality,
                religion: religion,
                tendency: tendency,
                language: language,
                level: level,
                interest: interest,
                hate: hate,
                wish: wish,
                introduce: introduce,
                url: url
            })
                .then(()=>{
                    console.log(userID + '회원 정보가 수정되었습니다.');
                    res.send(true)
                }).catch(err=>res.send(false));
        }
        else{
            const newProfile = new Profile({
                userID: userID,
                userName: userName,
                age: age,
                sex: sex,
                major: major,
                nationality: nationality,
                religion: religion,
                tendency: tendency,
                language: language,
                level: level,
                interest: interest,
                hate: hate,
                wish: wish,
                introduce: introduce,
                url : url
            });
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
            res.send(true);
        }else{
            res.send(false)
        }
    })
});

router.get('/view', (req,res)=>{
    user_ID = req.session.userID;
    send_check()
    let status = 0 ;
    Profile.findOne({userID:this_friendID}).then(profile=>{
        if(profile){
            for(i in profile.friend) {
                if (profile.friend[i] == user_ID)
                    status = 1;
            }
            for(i in profile.plus) {
                if (profile.plus[i] == user_ID)
                    status = 2;
            }
            res.render('../views/profile.ejs', {profile : profile, status : status, messagecount: messagecount, requestcount : requestcount});
        }else{
            res.render('../views/profile.ejs', {profile : "", messagecount: messagecount, requestcount : requestcount});
        }
    })
})

router.get('/view/request', (req,res)=>{
    user_ID = req.session.userID;
    send_check()
    let status = 3 ;
    Profile.findOne({userID:this_friendID}).then(profile=>{
        if(profile){
            res.render('../views/profile.ejs', {profile : profile, status : status, messagecount: messagecount, requestcount : requestcount});
        }else{
            res.render('../views/profile.ejs', {profile : "", messagecount: messagecount, requestcount : requestcount});
        }
    })
})

router.get('/myProfile', (req, res) => {
    user_ID = req.session.userID;
    send_check()
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    Profile.findOne({userID:user_ID}).then(profile=>{
        if(profile){
            res.render('../views/myProfile.ejs',{profile : profile, messagecount: messagecount, requestcount : requestcount});
        }else{
            res.render('../views/setProfile.ejs',{user : user_ID, messagecount: messagecount, requestcount : requestcount});
        }
    })
    // }
});

router.get('/community',async (req,res)=>{
    user_ID = req.session.userID;
    await send_check()
    let community=[]
    await Profile.find().then(profile=> {
        if(profile.length>1) {
            let state;
            for(i in profile){
                state=0;
                if(profile[i].userID==user_ID||profile[i].active==false){
                    state=1;
                }
                for(j in profile[i].friend) {
                    if (profile[i].friend[j] == user_ID) {
                        state=1;
                        break;
                    }
                }
                for(j in profile[i].block){
                    if(profile[i].block[j]==user_ID) {
                        state=1
                        break;
                    }
                }
                for(j in profile[i].plus){
                    if(profile[i].plus[j]==user_ID) {
                        state=1
                        break;
                    }
                }
                if(state==0){
                    community.push(profile[i])
                }
            }
            res.render('../views/community.ejs', {profile: community, messagecount: messagecount, requestcount : requestcount});
        }else {
            res.render('../views/community.ejs', {profile: "", messagecount: messagecount, requestcount : requestcount});
        }
    });
});

router.get('/play',(req,res)=>{
    user_ID = req.session.userID;
    send_check()
    let community=[]
    Profile.find().then(profile=> {
        if(profile.length>1) {
            let state;
            for(i in profile){
                state=0;
                if(profile[i].userID==user_ID){
                    state=1;
                }
                for(j in profile[i].friend) {
                    if (profile[i].friend[j] == user_ID) {
                        state=1;
                        break;
                    }
                }
                for(j in profile[i].block){
                    if(profile[i].block[j]==user_ID) {
                        state=1
                        break;
                    }
                }
                for(j in profile[i].plus){
                    if(profile[i].plus[j]==user_ID) {
                        state=1
                        break;
                    }
                }
                if(state===0&&profile[i].tendency=="play"){
                    community.push(profile[i])
                }
            }
            res.render('../views/community.ejs', {profile: community, messagecount: messagecount, requestcount : requestcount});
        }else {
            res.render('../views/community.ejs', {profile: "", messagecount: messagecount, requestcount : requestcount});
        }
    });
});

router.get('/study',(req,res)=>{
    user_ID = req.session.userID;
    send_check()
    let community=[]
    Profile.find().then(profile=> {
        if(profile.length>1) {
            let state;
            for(i in profile){
                state=0;
                if(profile[i].userID==user_ID){
                    state=1;
                }
                for(j in profile[i].friend) {
                    if (profile[i].friend[j] == user_ID) {
                        state=1;
                        break;
                    }
                }
                for(j in profile[i].block){
                    if(profile[i].block[j]==user_ID) {
                        state=1
                        break;
                    }
                }
                for(j in profile[i].plus){
                    if(profile[i].plus[j]==user_ID) {
                        state=1
                        break;
                    }
                }
                if(state===0&&profile[i].tendency=="study"){
                    community.push(profile[i])
                }
            }
            res.render('../views/community.ejs', {profile: community, messagecount: messagecount, requestcount : requestcount});
        }else {
            res.render('../views/community.ejs', {profile: "", messagecount: messagecount, requestcount : requestcount});
        }
    });
});

router.get('/culture',(req,res)=>{
    user_ID = req.session.userID;
    send_check()
    let community=[]
    Profile.find().then(profile=> {
        if (profile.length > 1) {
            let state;
            for (i in profile) {
                state = 0;
                if (profile[i].userID == user_ID) {
                    state = 1;
                }
                for (j in profile[i].friend) {
                    if (profile[i].friend[j] == user_ID) {
                        state = 1;
                        break;
                    }
                }
                for (j in profile[i].block) {
                    if (profile[i].block[j] == user_ID) {
                        state = 1
                        break;
                    }
                }
                for (j in profile[i].plus) {
                    if (profile[i].plus[j] == user_ID) {
                        state = 1
                        break;
                    }
                }
                if (state === 0 && profile[i].tendency == "culture") {
                    community.push(profile[i])
                }
            }
            res.render('../views/community.ejs', {profile: community, messagecount: messagecount, requestcount : requestcount});
        } else {
            res.render('../views/community.ejs', {profile: "", messagecount: messagecount, requestcount : requestcount});
        }
    });
});

router.get('/edit', (req, res) => {
    user_ID = req.session.userID;
    send_check()
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    Profile.findOne({userID:user_ID}).then(profile=>{
        if(profile){
            res.render('../views/editProfile.ejs',{profile : profile, messagecount: messagecount, requestcount : requestcount});
        }else{
            res.render('../views/setProfile.ejs',{user : user_ID, messagecount: messagecount, requestcount : requestcount});
        }
    })
    // }
});

router.post('/edit', (req, res) => {
    user_ID = req.session.userID;
    let active = req.body.active
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
    Profile.updateOne({userID:user_ID},{active : active}).then(profile=>{
        res.send(true);
    })
    // }
});
module.exports = router;
