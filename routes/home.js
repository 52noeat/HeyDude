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
let sortboard;
let auth1, auth2, auth3;
let generalUpdateid, semesterUpdateid, helpUpdateid;
let sessionName1, sessionName2, sessionName3;

/*HOME 그리기*/
router.get('/', async (req,res)=>{
    let sess = req.session;
    let user_name = req.session.userName;
        await generalBoard.find({}, function (err, board) {
            if(board) {
                generalboard = board;
            }
        });
        await semesterBoard.find({}, function (err, board) {
            if(board) {
                semesterboard = board;
            }
        });
        await helpBoard.find({}, function (err, board) {
            if(board) {
                res.render('../views/home.ejs', {title: 'Home', generalBoard: generalboard ,semesterBoard: semesterboard , helpBoard: board});
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
router.get('/semesterBoardSort', (req, res)=> {
    semesterBoard.find({semester: req.query.semester})
        .then(board=>{
            if(board) {
                sortboard = board;
                res.send('1');
            }
        })
});
router.get('/semesterBoardSortedPage/:page', function(req, res){
    let page = req.params.page;
    res.render('../views/semesterSortedBoardPage.ejs', {title: 'Semester Forum', board: sortboard, page_num: page_num, page: page})
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
    board.date = moment().format("MM-DD");
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
    board.semester = req.body.semester;
    board.time = moment().format("HH:mm");
    board.date = moment().format("MM-DD");
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
    board.date = moment().format("MM-DD");
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
    if(board1.userName == req.session.userName){
        auth1 = 1;
    }
    board1.save(function (err) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
    });
    sessionName1 = req.session.userName;
    res.render('../views/generalBoard.ejs',{title:"title",board :board1, auth:auth1, sessionName:sessionName1});
    console.log(auth1);
    auth1 = 0;
});
router.get('/semesterSetboard', (req, res)=> {
    board2.view_num += 1;
    if(board2.userName == req.session.userName){
        auth2 = 1;
    }
    board2.save(function (err) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
    });
    sessionName2 = req.session.userName;
    res.render('../views/semesterBoard.ejs',{title:"title",board :board2, auth:auth2, sessionName:sessionName2});
    console.log(auth2);
    auth2 = 0;
});
router.get('/helpSetboard', (req, res)=> {
    board3.view_num += 1;
    if(board3.userName == req.session.userName){
        auth3 = 1;
    }
    board3.save(function (err) {
        if(err){
            console.log(err);
            res.redirect('/home');
        }
    });
    sessionName3 = req.session.userName;
    res.render('../views/helpBoard.ejs',{title:"title",board :board3, auth:auth3, sessionName:sessionName3});
    console.log(auth3);
    auth3 = 0;
});

/*댓글 DB에 저장*/
router.post('/generalComment/write', function (req, res){
    var comment = new generalComment();
    comment.contents = req.body.contents;
    comment.userName = req.session.userName;
    comment.comment_date = Date.now();
    comment.date = moment().format("MM-DD");
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
    comment.date = moment().format("MM-DD");

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
    comment.date = moment().format("MM-DD");

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
        if (req.session.userName == board.userName){
            sessionName1 = req.session.userName;
            res.render('../views/generalBoard.ejs', {title: 'Board', board: board, auth: 1, sessionName:sessionName1});
        }
        else{
            sessionName1 = req.session.userName;
            res.render('../views/generalBoard.ejs', {title: 'Board', board: board, auth: 0, sessionName:sessionName1});
        }
    })
});
router.get('/semesterSetboard/comment', function (req, res) {
    semesterBoard.findOne({_id: id2}, function (err, board) {
        if (req.session.userName == board.userName){
            sessionName2 = req.session.userName;
            res.render('../views/semesterBoard.ejs', {title: 'Board', board: board, auth: 1, sessionName:sessionName2});
        }
        else{
            sessionName2 = req.session.userName;
            res.render('../views/semesterBoard.ejs', {title: 'Board', board: board, auth: 0, sessionName:sessionName2});
        }
    })
});
router.get('/helpSetboard/comment', function (req, res) {
    helpBoard.findOne({_id: id3}, function (err, board) {
        if (req.session.userName == board.userName){
            sessionName3 = req.session.userName;
            res.render('../views/helpBoard.ejs', {title: 'Board', board: board, auth: 1, sessionName:sessionName3});
        }
        else{
            sessionName3 = req.session.userName;
            res.render('../views/helpBoard.ejs', {title: 'Board', board: board, auth: 0, sessionName:sessionName3});
        }
    })
});
/*id를 이용해 게시글 Delete*/
router.get('/generalDelete', (req, res)=> {
    if(req.query.userName !== req.session.userName){
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
        console.log("if문 no permission");
        res.send('2');
    }
    else {
        generalUpdateid = req.query.id;
        res.send('1');
    }
});
router.get('/generalUpdateWrite', (req, res)=> {

        generalBoard.findOne({_id: generalUpdateid}, function (err, board) {
            console.log(board);
            res.render('../views/generalUpdateWrite.ejs', {board: board});
        });
});
router.post('/generalUpdateSave', (req, res) => {
    auth1 = 1;
    generalBoard.findOne({_id : generalUpdateid}, function (err, result) {
        result.title = req.body.title;
        result.contents = req.body.contents;
        result.board_date = Date.now();
        result.userName = req.session.userName;
        result.time = moment().format("HH:mm");
        result.date = momnet().format("MM-DD");
        result.save(function (err) {
            if(err){
                console.log(err);
                alert("Login please");
                res.redirect('/home');
            }
            sessionName1 = req.session.userName;
            res.render('../views/generalBoard.ejs', {board :result, auth:auth1, sessionName:sessionName1});
            auth1 = 0;
        });
    });
})
//semester board update
router.get('/semesterUpdate', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        console.log("if문 no permission");
        res.send('2');
    }
    else {
        semesterUpdateid = req.query.id;
        res.send('1');
    }
});
router.get('/semesterUpdateWrite', (req, res)=> {

    semesterBoard.findOne({_id: semesterUpdateid}, function (err, board) {
        console.log(board);
        res.render('../views/semesterUpdateWrite.ejs', {board: board});
    });
});
router.post('/semesterUpdateSave', (req, res) => {
    auth2 = 1;
    semesterBoard.findOne({_id : semesterUpdateid}, function (err, result) {
        result.title = req.body.title;
        result.contents = req.body.contents;
        result.board_date = Date.now();
        result.userName = req.session.userName;
        result.time = moment().format("HH:mm");
        result.date = momnet().format("MM-DD");
        result.save(function (err) {
            if(err){
                console.log(err);
                alert("Login please");
                res.redirect('/home');
            }
            sessionName2 = req.session.userName;
            res.render('../views/semesterBoard.ejs', {board :result, auth:auth2, sessionName:sessionName2});
            auth2 = 0;
        });
    });
})
//helpboard update
router.get('/helpUpdate', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        console.log("if문 no permission");
        res.send('2');
    }
    else {
        helpUpdateid = req.query.id;
        res.send('1');
    }
});
router.get('/helpUpdateWrite', (req, res)=> {

    helpBoard.findOne({_id: helpUpdateid}, function (err, board) {
        console.log(board);
        res.render('../views/helpUpdateWrite.ejs', {board: board});
    });
});
router.post('/helpUpdateSave', (req, res) => {
    auth3 = 1;
    helpBoard.findOne({_id : helpUpdateid}, function (err, result) {
        result.title = req.body.title;
        result.contents = req.body.contents;
        result.board_date = Date.now();
        result.userName = req.session.userName;
        result.time = moment().format("HH:mm");
        result.date = momnet().format("MM-DD");
        result.save(function (err) {
            if(err){
                console.log(err);
                alert("Login please");
                res.redirect('/home');
            }
            sessionName3 = req.session.userName;
            res.render('../views/helpBoard.ejs', {board :result, auth:auth3, sessionName:sessionName3});
            auth3 = 0;
        });
    });
})
//comment delete
router.get('/generalCommentDelete', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        res.send('2');
    }else {
        console.log("id는")
        console.log(req.query.id)
        generalBoard.findOneAndUpdate({_id: req.query.boardid}, {$pull: {comments:{_id: req.query.id}}}, function (err, board) {
            if (err) {
                console.log(err);
                res.redirect('/home');
            }
            id1 = board._id;
            res.send('1');
        });
    }
});
router.get('/semesterCommentDelete', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        res.send('2');
    }else {
        console.log("id는")
        console.log(req.query.id)
        semesterBoard.findOneAndUpdate({_id: req.query.boardid}, {$pull: {comments:{_id: req.query.id}}}, function (err, board) {
            if (err) {
                console.log(err);
                res.redirect('/home');
            }
            id2 = board._id;
            res.send('1');
        });
    }
});
router.get('/helpCommentDelete', (req, res)=> {
    if(req.query.userName !== req.session.userName){
        res.send('2');
    }else {
        console.log("id는")
        console.log(req.query.id)
        helpBoard.findOneAndUpdate({_id: req.query.boardid}, {$pull: {comments:{_id: req.query.id}}}, function (err, board) {
            if (err) {
                console.log(err);
                res.redirect('/home');
            }
            id3 = board._id;
            res.send('1');
        });
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
