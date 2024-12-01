import { writeUserData, createUser, loginUser } from './DatabaseManager.js';

// document.getElementById('createBtn').addEventListener("click", () => {
//     writeUserData(
//         document.getElementById('create-level').value,
//         document.getElementById('create-name').value,
//         document.getElementById('create-health').value
//     );
// });

// document.getElementById('signupbtn').addEventListener("click", () => {
//     createUser(
//         document.getElementById('authemail').value,
//         document.getElementById('authpassword').value
//     )
// });

// document.getElementById('loginbtn').addEventListener("click", () => {
//     loginUser(
//         document.getElementById('authemail').value,
//         document.getElementById('authpassword').value
//     )
// });

// Switch Pages Functions
document.getElementById('loginherebtn').addEventListener("click", () => { 
    console.log("switching to login")
    document.getElementById('signupModal').classList.add("hidden")
    document.getElementById('loginModal').classList.remove("hidden")
});
document.getElementById('signupherebtn').addEventListener("click", () => { 
    console.log("switching to signup")
    document.getElementById('signupModal').classList.remove("hidden")
    document.getElementById('loginModal').classList.add("hidden")
});
