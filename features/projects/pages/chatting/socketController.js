const controller = (socket) => {
    socket.on('message', (msg) => {
        console.log(msg);
    })
}
export default controller;