
const chatform = document.getElementById('chat-form')
const messages = document.querySelector('.chat-messages')
const room = document.getElementById('room-name')
const userList = document.getElementById('users')

// get user name and room from url -- whenever we submit a form the url gets everything stored
const {username,room} =Qs.parse(location.search,{ignoreQueryPrefix: true})
// codepending
// qs parses the data from the url 
const socket = io()

// join chat room
socket.emit('joinRoom', {
    username, 
    room
})
// get room and users 
socket.on('roomUsers',({room, users})=>{
    outputRoomName(room)
    OutputUsers(users)
})

// message from server
socket.on('message',(message)=>{
    outputMsg(message) 
})

// scroll down
messages.scrollTop = messages.scrollHeight;


// message submit
chatform.addEventListener('submit',function(e){
    e.preventDefault()
    // get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim()
    if(!msg){
        return false;
    }

    // emit message to server
socket.emit('chatmessage',msg)

// clear input
e.target.elements.msg.value = ''
// e --> event with eventlistiner
e.target.elements.msg.focus()
    
})
// output message to dom (display in html)
function outputMsg(message){
    const div = document.createElement('div')
    div.classList.add('message')
    const p = document.createElement('p')
    p.classList.add('meta')
    p.innerText = message.username
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para =document.createElement(p)
    para.classList.add('text')
    para.innerText = message.text
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild('div')
}

// add room name to dom
function outputRoomName(room){
    room.innerText = room

}
// add users to dom
function OutputUsers(users){
    userList.innerHTML = ''
    users.forEach((user)=>{
        const li = document.createElement('li')
        li.innerText = user.username
        userList.appendChild(li)

    })
}

// prompt the user before leaving the chat room
document.getElementById('leave-btn').addEventListener('click',function(){
    const leaveRoom = confirm('are you sure you want to leave the chat-room ?');
    if(leaveRoom){
        window.location = '../index.html';
    }
})


