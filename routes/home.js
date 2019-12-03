const express = require('express');
const session = require('express-session');
const router = express.Router();
const moment = require('moment');
// Load User model
const {User, Profile, FriendList, Request, Chat, generalBoard, generalComment, semesterBoard, semesterComment, helpBoard, helpComment}=require('../models/index');

let id1, id2, id3;
let page_num = 10;
let t2;
let generalboard;
let semesterboard;
let board1, board2, board3;

/*HOME 그리기*/
router.get('/', async (req,res)=>{
    let sess = req.session;
    let user_name = req.session.userName;
        await generalBoard.find({}, function (err, board) {
            if(board) {
                generalboard = board;
                console.log("complete1")
            }
        });
        await semesterBoard.find({}, function (err, board) {
            if(board) {
                semesterboard = board;
                console.log("complete2")
            }
        });
        await helpBoard.find({}, function (err, board) {
            if(board) {
                res.render('../views/home.ejs', {title: 'Home', generalBoard: generalboard ,semesterBoard: semesterboard , helpBoard: board});
                console.log("complete3")
                console.log('-----------------')
            }
        });
});

/*게시판 페이지 그리기*/
router.get('/generalBoard/:page', function(req, res){
    let page = req.params.page;
    generalBoard.find({}, function (err, board){
        if(board){
            res.render('../views/generalBoardPage.ejs', {title: 'General Forum', board: board, page_num: page_num, page: page});
        }
    });
});
router.get('/semesterBoard/:page', function(req, res){
    let page = req.params.page;
    semesterBoard.find({}, function (err, board){
        if(board){
            res.render('../views/semesterBoardPage.ejs', {title: 'Semester Forum', board: board, page_num: page_num, page: page});
        }
    });
});
router.get('/helpBoard/:page', function(req, res){
    let page = req.params.page;
    helpBoard.find({}, function (err, board){
        if(board){
            res.render('../views/helpBoardPage.ejs', {title: 'Help Forum', board: board, page_num: page_num, page: page});
        }
    });
});

/*게시판별 글쓰기 페이지 그리기*/
router.get('/generalwrite', function(req, res, next) {
    res.render('../views/generalWrite.ejs');
});
router.get('/semesterwrite', function(req, res, next) {
    res.render('../views/semesterWrite.ejs');
});
router.get('/helpwrite', function(req, res, next) {
    res.render('../views/helpWrite.ejs');
});

/*글쓴 정보 각 DB 테이블에 저장*/
router.post('/board/generalwrite', function (req, res) {
    var board = new generalBoard();
    board.title = req.body.title;
    board.contents = req.body.contents;
    board.board_date = Date.now();
    board.userName = req.session.userName;
    board.time = moment().format("HH:mm");
    board.save(function (err) {
        if(err){
            console.log(err);
            alert("Login please");
            res.redirect('/home');
        }
        res.redirect('/home/generalBoard/1');
    });
});
router.post('/board/semesterwrite', function (req, res) {
    var board = new semesterBoard();
    board.title = req.body.title;
    board.contents = req.body.contents;
    board.board_date = Date.now();
    board.userName = req.session.userName;
    board.time = moment().format("HH:mm");
    board.save(function (err) {
        if(err){
            console.log(err);
            alert("Login please");
            res.redirect('/home');
        }
        res.redirect('/home/semesterBoard/1');
    });
});
router.post('/board/helpwrite', function (req, res) {
    var board = new helpBoard();
    board.title = req.body.title;
    board.contents = req.body.contents;
    board.board_date = Date.now();
    board.userName = req.session.userName;
    board.time = moment().format("HH:mm");
    board.save(function (err) {
        if(err){
            console.log(err);
            alert("Login please");
            res.redirect('/home');
        }
        res.redirect('/home/helpBoard/1');
    });
});

/* id로 맞는 게시글 찾고 글 세부내용 render */
router.get('/generalBoard', (req, res)=> {
    generalBoard.findOne({_id: req.query.id})
        .then(board=>{
            if(board) {
                board1 = board;
                res.send('1')
            }else{
                res.send('2')
            }
        })
});
router.get('/semesterBoard', (req, res)=> {
    semesterBoard.findOne({_id: req.query.id})
        .then(board=>{
            if(board) {
                board2 = board;
                res.send('1')
            }else{
                res.send('2')
            }
        })
});
router.get('/helpBoard', (req, res)=> {
    helpBoard.findOne({_id: req.query.id})
        .then(board=>{
            if(board) {
                board3 = board;
                res.send('1')
            }else{
                res.send('2')
            }
        })
});
router.get('/generalSetboard', (req, res)=> {
    board1.view_num += 1;
    board1.save(function (err) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
    });
    res.render('../views/generalBoard.ejs',{title:"title",board :board1});
});
router.get('/semesterSetboard', (req, res)=> {
    board2.view_num += 1;
    board2.save(function (err) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
    });
    res.render('../views/semesterBoard.ejs',{title:"title",board :board2});
});
router.get('/helpSetboard', (req, res)=> {
    board3.view_num += 1;
    board3.save(function (err) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
    });
    res.render('../views/helpBoard.ejs',{title:"title",board :board3});
});

/*댓글 DB에 저장*/
router.post('/generalComment/write', function (req, res){
    var comment = new generalComment();
    comment.contents = req.body.contents;
    comment.userName = req.session.userName;
    comment.comment_date = Date.now();
    comment.time = moment().format("HH:mm");

    generalBoard.findOneAndUpdate({_id : req.body.id}, { $push: { comments : comment}}, function (err, board) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
        id1 = req.body.id;
            res.redirect('/home/generalSetboard/comment');
    });
});
router.post('/semesterComment/write', function (req, res){
    var comment = new semesterComment();
    comment.contents = req.body.contents;
    comment.userName = req.session.userName;
    comment.comment_date = Date.now();
    comment.time = moment().format("HH:mm");

    semesterBoard.findOneAndUpdate({_id : req.body.id}, { $push: { comments : comment}}, function (err, board) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
        id2 = req.body.id;
        res.redirect('/home/semesterSetboard/comment');
    });
});
router.post('/helpComment/write', function (req, res){
    var comment = new helpComment();
    comment.contents = req.body.contents;
    comment.userName = req.session.userName;
    comment.comment_date = Date.now();
    comment.time = moment().format("HH:mm");

    helpBoard.findOneAndUpdate({_id : req.body.id}, { $push: { comments : comment}}, function (err, board) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
        id3 = req.body.id;
        res.redirect('/home/helpSetboard/comment');
    });
});
/* id를 이용해 댓글추가된 페이지 다시 렌더링 */
router.get('/generalSetboard/comment', function (req, res) {
    generalBoard.findOne({_id: id1}, function (err, board) {
            res.render('../views/generalBoard.ejs', {title: 'Board', board: board});
    })
});
router.get('/semesterSetboard/comment', function (req, res) {
    semesterBoard.findOne({_id: id2}, function (err, board) {
        res.render('../views/semesterBoard.ejs', {title: 'Board', board: board});
    })
});
router.get('/helpSetboard/comment', function (req, res) {
    helpBoard.findOne({_id: id3}, function (err, board) {
        res.render('../views/helpBoard.ejs', {title: 'Board', board: board});
    })
});
/*id를 이용해 게시글 Delete*/
router.get('/generalDelete', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        console.log("no permission");
        res.send('2');
    }else {
        generalBoard.deleteOne({_id: req.query.id})
            .then(board => {
                if (board) {
                    res.send('1');
                }
            })
    }
});
router.get('/semesterDelete', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        console.log("no permission");
        res.send('2');
    }else {
        semesterBoard.deleteOne({_id: req.query.id})
            .then(board => {
                if (board) {
                    res.send('1');
                }
            })
    }
});
router.get('/helpDelete', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        console.log("no permission");
        res.send('2');
    }else {
        helpBoard.deleteOne({_id: req.query.id})
            .then(board => {
                if (board) {
                    res.send('1');
                }
            })
    }
});
/*id를 이용해 게시글 Update*/
router.get('/generalUpdate', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        console.log("no permission");
        res.send('2');
    }else {
        res.send('1');
    }
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

module.exports = router;
