const socket = io();
const client = document.getElementById("client")
const submit = document.getElementById("submit")
const player1 = document.getElementById("player1")
const player2 = document.getElementById("player2")
const container = document.getElementById("container")
const play = document.getElementById("play")
let selected = ""
let selectedRival = ""
let rival = player2.querySelectorAll('IMG')

const chooseOption = (el) =>{
    if(selected == ""){
        el.parentElement.classList.add("active")
        selected = el
        return
    }

    selected.parentElement.classList.remove("active")
    el.parentElement.classList.add("active")
    selected = el
}

socket.on("disconnect", ()=>{
    container.innerHTML = "<p>La sala está llena!</p>"
    container.classList.remove("container")
    container.classList.add("espera")
})

socket.on("rivalChoose", (jugada)=>{
    console.log(jugada)
})

socket.on("restart", ()=>{
    selected.parentElement.classList.remove("active")
    selected = ""
    selectedRival.classList.remove("rival")
    selectedRival = "" 
})

socket.on("response", (opcion)=>{
    rival.forEach(img =>{
        if(img.id === opcion){
            img.parentElement.classList.add("rival")
            selectedRival = img.parentElement
        }
    })
})

player1.addEventListener("click", (event)=>{
    if(event.target.tagName === "IMG")
        chooseOption(event.target)
})

play.addEventListener("click", ()=>{
    if(selected != ""){
        let opcion = selected.src.slice(selected.src.lastIndexOf("/")+1, selected.src.lastIndexOf("."))
        socket.emit("ready", opcion)
    }
})
