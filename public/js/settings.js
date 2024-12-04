import { getPlayerDetails, auth, changeEmail, changeUsername, changePassword, reauthenticateAuth, deleteAccount } from './DatabaseManager.js';

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
      storeNameText.textContent = playerDetails.db.storeName;
    } catch (error) {
      console.error("Error fetching player details:", error);
    }
  } else {
    console.log("No user is logged in.");
  }
});

//Change Password
document.getElementById('changePasswordBtn').addEventListener("click", () => {
    console.log("Change Password!")
    if (reauthenticateAuth(auth.currentUser.email, document.getElementById('currentPasswordText').value)) {
        changePassword(document.getElementById('newPasswordText').value)
    } else {
        console.log("wrong password!")
    }
});

//Change Email
document.getElementById('changeEmailBtn').addEventListener("click", () => {
    console.log("Change Email!")
    document.getElementById('changeEmailBtn').classList.add("hidden")
    document.getElementById('changeEmailLabel').classList.remove("hidden")
    document.getElementById('changeUsernameBtn').classList.remove("hidden")
    document.getElementById('changeUsernameLabel').classList.add("hidden")
});

document.getElementById('changeEmailCfmBtn').addEventListener("click", () => {
    changeEmail(document.getElementById('newEmailText').value)
});

// Change Username
document.getElementById('changeUsernameBtn').addEventListener("click", () => {
    console.log("Change Username!")
    document.getElementById('changeUsernameBtn').classList.add("hidden")
    document.getElementById('changeUsernameLabel').classList.remove("hidden")
    document.getElementById('changeEmailBtn').classList.remove("hidden")
    document.getElementById('changeEmailLabel').classList.add("hidden")
});

document.getElementById('changeUsernameCfmBtn').addEventListener("click", () => {
    changeUsername(document.getElementById('newUsernameText').value)
});

// Delete or Deactivate Account
document.getElementById('deleteAccountBtn').addEventListener("click", () => {
    console.log("Delete Account!")
    document.getElementById('confirmationModal').classList.remove("hidden")
});

document.getElementById('deleteAccountCfmBtn').addEventListener("click", () => {
    console.log("Confirm: Delete Account")
    document.getElementById('confirmationModal').classList.add("hidden")
    deleteAccount()
});

document.getElementById('deleteAccountCancelBtn').addEventListener("click", () => {
    console.log("Cancel: Delete Account")
    document.getElementById('confirmationModal').classList.add("hidden")

});

// Settings Page Switching
document.getElementById('accountSettingsBtn').addEventListener("click", () => {
    console.log("Account Settings!")
    document.getElementById('accountSettingsBtn').classList.remove("border-transparent")
    document.getElementById('storeSettingsBtn').classList.add("border-transparent")
    document.getElementById('accountSettingsModal').classList.remove("hidden")
    document.getElementById('storeSettingsModal').classList.add("hidden")
});

document.getElementById('storeSettingsBtn').addEventListener("click", () => {
    console.log("Store Settings!")
    document.getElementById('accountSettingsBtn').classList.add("border-transparent")
    document.getElementById('storeSettingsBtn').classList.remove("border-transparent")
    document.getElementById('accountSettingsModal').classList.add("hidden")
    document.getElementById('storeSettingsModal').classList.remove("hidden")
});