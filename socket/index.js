const app = require('../app');
const {Chat}=require('../models/index');

const server = app.listen(3000, function () {
    console.log('Socket running on port 3000');
});
const io = require('socket.io')(server);
io.on('connect', (socket) => {
    socket.on('channelJoin', (data) => {
        console.log(data);
        const {chatCode, userID, userName} = data;
        const user = {userName: userName, userID: userID, chatCode: chatCode }
        socket.user = user
        socket.join(chatCode); //같은 room에 입장
        io.to(chatCode).clients((err, clients) => {
            console.log(chatCode+'방 채팅 인원:'+clients.length);
        });
        io.to(chatCode).emit('joinSuccess', user);
    })

    // socket.on('getUsers', async (data) => {
    //     const { chatCode, socketID } = data;
    //
    //     let users = []
    //     await io.to(chatCode).clients((err, clients) => {
    //         clients.forEach(client => {
    //             const user = io.connected[client].user;
    //             users.push(user);
    //         });
    //     });
    //     io.to(socketID).emit('getUsers', users)
    // })

    socket.on('chat', (data) => {
        const { chatCode } = data
        const newChat = new Chat(data);
        newChat.save()
            .then(result => {
                io.to(chatCode).emit('MESSAGE', result)
            })
            .catch(err => console.log(err))
    });

    // socket.on('delete', (data)=>{
    //     let QesID = data
    //     Chat.findOne({QesID : QesID })
    //     .then(result => {
    //         if(result){
    //             result.remove()
    //             io.to(socket.user.chatCode).emit("delete", result)
    //         }
    //     })
    //     .catch(err=> {
    //         console.log(err)
    //     })
    // })

    socket.on('disconnect', () => {
        const user = socket.user;
        if (user) {
            io.to(user.chatCode).emit('disconnect', user)
            socket.leave(user.chatCode)
        }
    });
});
