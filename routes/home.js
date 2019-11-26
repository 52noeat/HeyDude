const express = require('express');
const session = require('express-session');
const router = express.Router();
const moment = require('moment');
// Load User model
const {User, Profile, FriendList, Request, Chat,Board,Comment}=require('../models/index');

let this_board;
let id;
let HH_mm;

router.get('/',(req,res)=>{
    let sess = req.session;
    let user_name = req.session.userName;
        Board.find({}, function (err, board) {
            if(board) {
                res.render('../views/home.ejs', {title: 'General Forum', board: board});
            }
            else{
                alert("Login Please")
                res.render('../views/signin.ejs');
            }
        });
});
/* Write board page */
router.get('/write', function(req, res, next) {
    res.render('../views/write.ejs', { title: '글쓰기' });
});
/* board insert mongo */
router.post('/board/write', function (req, res) {
    var board = new Board();
    board.title = req.body.title;
    board.contents = req.body.contents;
    board.author = req.body.author;
    board.board_date = Date.now();
    board.userName = req.session.userName;
    board.HH_mm = moment().format("HH:mm");
    board.save(function (err) {
        if(err){
            console.log(err);
            alert("Login please");
            res.redirect('/home');
        }
        res.redirect('/home');
    });
});
/* board find by id */
router.get('/board', (req, res)=> {
    console.log("아이디")
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
    this_board.view_num += 1;
    this_board.save(function (err) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
    });
    res.render('../views/board.ejs',{title:"title",board :this_board});
});
/* comment insert mongo*/
router.post('/comment/write', function (req, res){
    var comment = new Comment();
    comment.contents = req.body.contents;
    comment.author = req.body.author;
    comment.comment_date = Date.now();

    Board.findOneAndUpdate({_id : req.body.id}, { $push: { comments : comment}}, function (err, board) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
        id = req.body.id;
            res.redirect('/home/setboard/comment');
    });
});
/* board find by id */
router.get('/setboard/comment', function (req, res) {
    Board.findOne({_id: id}, function (err, board) {
            res.render('../views/board.ejs', {title: 'Board', board: board});
    })
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

// router.get('/page/2', function(req, res){
//     Board.find({}, function (err, board) {
//         if(board) {
//             res.render('../views/generalBoardPage.ejs', {title: 'General Forum',board: board, page: 2, page_num: 10})
//         }
//     });
// })

module.exports = router;
