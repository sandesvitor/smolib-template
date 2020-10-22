const io = require('socket.io-client')
const socket = io("http://localhost:5000/")

const display = document.querySelector('.messages-display')
const input = document.querySelector('.messages-input input')
const button = document.querySelector('.messages-input button')

const userHash = {}

const roomState = {
    currentMessage: "",
    receivedMEssage: ""
}

socket.on("connect", () => {

    console.log("Congratz!\nYou are connected with Socket Server!")

    socket.on("whoAmI", id => {
        userHash.id = id
    })

    input.addEventListener("change", e => {
        e.preventDefault()
        roomState.currentMessage = e.target.value
    })

    button.addEventListener("click", e => {
        e.preventDefault()
        if (roomState.currentMessage.trim() != "") {
            socket.emit("sendMessage", roomState.currentMessage)
        }
    })


    socket.on("roomData", message => {
        // creating message template:
        // Later, you should implement a better variable to 
        // handle identification!
        const parsedMessage = JSON.parse(message)
        console.debug(parsedMessage)

        const id = parsedMessage.id
        const msgContent = parsedMessage.message

        const msgContainer = document.createElement('div')
        msgContainer.classList.add('message-container')
        if (id == userHash.id) {
            msgContainer.setAttribute('sender', 'me')
        } else {
            msgContainer.setAttribute('sender', 'other')
        }

        const senderName = document.createElement('div')
        senderName.classList.add('sender-name')
        senderName.innerText = id

        const msgUnit = document.createElement('div')
        msgUnit.classList.add('message')
        msgUnit.innerText = msgContent

        msgContainer.appendChild(senderName)
        msgContainer.appendChild(msgUnit)

        display.appendChild(msgContainer)

        display.scrollTop = display.scrollHeight
    })
})
