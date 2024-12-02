import { getPlayerDetails, auth } from './DatabaseManager.js';

const usernameText = document.getElementById('usernameText');
const emailText = document.getElementById('emailText');
const currentPasswordText = document.getElementById('currentPasswordText');
const newPasswordText = document.getElementById('newPasswordText');

auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log("User is logged in with UID:", user.uid);

    try {
      const playerDetails = await getPlayerDetails(user.uid);
      console.log("Player details:", playerDetails);

      usernameText.textContent = playerDetails.db.name;
      emailText.textContent = playerDetails.auth.email;
    } catch (error) {
      console.error("Error fetching player details:", error);
    }
  } else {
    console.log("No user is logged in.");
  }
});

document.getElementById('changePasswordBtn').addEventListener("click", () => {
    console.log("Change Password!")
    if ((document.getElementById('currentPasswordText').value) == (document.getElementById('currentPasswordText').value)) {

    } else {
        console.log("Please Ensure That the Passwords Match!")
    }
});

document.getElementById('changeEmailBtn').addEventListener("click", () => {
    console.log("Change Email!")
    
});

document.getElementById('changeUsernameBtn').addEventListener("click", () => {
    console.log("Change Username!")
    
});

document.getElementById('deleteAccountBtn').addEventListener("click", () => {
    console.log("Delete Account!")
    
});