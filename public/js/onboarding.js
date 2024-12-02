import { createUser, loginUser, resetPassword } from './DatabaseManager.js';

// document.getElementById('createBtn').addEventListener("click", () => {
//     writeUserData(
//         document.getElementById('create-level').value,
//         document.getElementById('create-name').value,
//         document.getElementById('create-health').value
//     );
// });

// Sign Up
document.getElementById('signupbtn').addEventListener("click", () => {
    console.log("signup!")
    if ((document.getElementById('signuppassword').value) == (document.getElementById('signupconfirmpassword').value)) {
        createUser(
            document.getElementById('signupusername').value,
            document.getElementById('signupemail').value,
            document.getElementById('signuppassword').value
        )
    } else {
        console.log("Please Ensure That the Passwords Match!")
    }
});

// Log in
document.getElementById('loginbtn').addEventListener("click", () => {
    console.log("login!")
    loginUser(
        document.getElementById('loginemail').value,  
        document.getElementById('loginpassword').value
    )
});

document.getElementById('resetpwbtn').addEventListener("click", () => {
    console.log("reset password!")
    resetPassword(
        document.getElementById('resetpwemail').value,  
    )
});


// Switch Pages Functions
document.getElementById('loginherebtn').addEventListener("click", () => { 
    console.log("switching to login")
    document.getElementById('signupModal').classList.add("hidden")
    document.getElementById('loginModal').classList.remove("hidden")
});
document.getElementById('resetpw-loginherebtn').addEventListener("click", () => { 
    console.log("switching to login")
    document.getElementById('resetPWModal').classList.add("hidden")
    document.getElementById('loginModal').classList.remove("hidden")
});
document.getElementById('signupherebtn').addEventListener("click", () => { 
    console.log("switching to signup")
    document.getElementById('signupModal').classList.remove("hidden")
    document.getElementById('loginModal').classList.add("hidden")
});
document.getElementById('resetpwherebtn').addEventListener("click", () => { 
    console.log("switching to resetpw")
    document.getElementById('resetPWModal').classList.remove("hidden")
    document.getElementById('loginModal').classList.add("hidden")
});
