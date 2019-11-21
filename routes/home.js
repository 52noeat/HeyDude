const express = require('express');
const session = require('express-session');
const router = express.Router();
// Load User model
const {User, Profile, FriendList, Request, Chat,Board,Comment}=require('../models/index');

let this_board;

router.get('/',(req,res)=>{
    // console.log("!!!")
    let sess = req.session
    // if(!sess.userID){
    //     res.render('../views/signin.ejs');
    // }else{
        Board.find({}, function (err, board) {
            res.render('../views/home.ejs', { title: 'Express', board: board });
        });
    // }
});

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

/* board find by id */
router.get('/board', (req, res)=> {
    console.log(req.query.id)
    Board.findOne({_id: req.query.id})
        .then(board=>{
        if(board) {
            this_board = board;
            res.send('1')
        }else{
            res.send('2')
        }
    })
});
router.get('/setboard', (req, res)=> {
    res.render('../views/board.ejs',{title:"title",board :this_board});
});

module.exports = router;
