import { writeUserData, createUser, loginUser } from './DatabaseManager.js';

document.getElementById('createBtn').addEventListener("click", () => {
    writeUserData(
        document.getElementById('create-level').value,
        document.getElementById('create-name').value,
        document.getElementById('create-health').value
    );
});

document.getElementById('signupbtn').addEventListener("click", () => {
    createUser(
        document.getElementById('authemail').value,
        document.getElementById('authpassword').value
    )
});

document.getElementById('loginbtn').addEventListener("click", () => {
    loginUser(
        document.getElementById('authemail').value,
        document.getElementById('authpassword').value
    )
});

