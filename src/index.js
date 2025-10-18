const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT ?? 3000

app.use(express.static("public"))

let players = []

io.on('connection', (socket)=>{
    
    if(players.length < 2) {
        players.push({"id":socket.id, "status":false, "option":""})
    }else{
        socket.disconnect()
    }

    socket.on('ready',(opcion)=>{
        players.forEach(p =>{
            if(p.id === socket.id){
                p.status = true
                p.option = opcion
            }
        })

        if(players.length === 2 && players.every(p => p.status === true)){
            console.log(players)
            io.to(players[0].id).emit("response", (players[1].option))
            io.to(players[1].id).emit("response", (players[0].option))

            players.forEach(p => {
                p.status = false
                p.option = ""
            })

            setTimeout(()=>{
                io.emit("restart")
            }, 5000)
        }
    })

    socket.on("disconnect", ()=>{

        players = players.filter(u => u.id != socket.id)
    })

})

server.listen(PORT)