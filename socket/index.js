const app = require('../app');
const {Chat}=require('../models/index');
const server = app.listen(3000, function () {
    console.log('Socket running on port 3000');
});
const io = require('socket.io')(server);
const chattingIO = io.of('/chatting');
chattingIO.on('connect', (socket) => {
    socket.on('channelJoin', (data) => {
        const { chatCode, userID, userName} = data;
        const user = {userName: userName, userID: userID, chatCode: chatCode }
        socket.user = user
        socket.join(chatCode); //같은 room에 입장
        chattingIO.to(chatCode).clients((err, clients) => {
            console.log(chatCode+'방 채팅 인원:'+clients.length);
        });
        chattingIO.to(chatCode).emit('joinSuccess', user);
    })
    socket.on('getUsers', async (data) => {
        const { chatCode, socketID } = data;

        let users = []
        await chattingIO.to(chatCode).clients((err, clients) => {
            clients.forEach(client => {
                const user = chattingIO.connected[client].user;
                users.push(user);
            });
        });
        chattingIO.to(socketID).emit('getUsers', users)
    })
    socket.on('chat', (data) => {
        const { chatCode } = data
        const newQuestion = new Question(data);
        newQuestion.save()
            .then(result => {
                chattingIO.to(chatCode).emit('MESSAGE', result)
            })
            .catch(err => console.log(err))
    });
    socket.on('delete', (data)=>{
        let QesID = data
        Question.findOne({QesID : QesID })
        .then(result => {
            if(result){
                result.remove()
                chattingIO.to(socket.user.chatCode).emit("delete", result)
            }
        })
        .catch(err=> {
            console.log(err)
        })
    })

    socket.on('disconnect', () => {
        const user = socket.user;
        if (user) {
            chattingIO.to(user.chatCode).emit('disconnect', user)
            socket.leave(user.chatCode)
        }
    });
});
