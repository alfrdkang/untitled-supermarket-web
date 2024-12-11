import { getPlayerDetails, auth, lobbySessionListen, updateWebReadyStatus } from './DatabaseManager.js';

document.addEventListener("DOMContentLoaded", () => {

    const webReadyStatusText = document.getElementById('webReadyStatusText')
    const webReadyBG = document.getElementById('webReadyBG')
    const vrReadyStatusText = document.getElementById('vrReadyStatusText')
    const vrReadyBG = document.getElementById('vrReadyBG')
    const readyBtn = document.getElementById('readyBtn')
    const lobbyTitle = document.getElementById('lobbyTitle')

    var webReadyStatus = false
    var gameReadyStatus = false

    auth.onAuthStateChanged(async (user) => {
        if (user) {
        console.log("User is logged in with UID:", user.uid);
    
        try {
            const playerDetails = await getPlayerDetails(user.uid);
            console.log("Player details:", playerDetails);
    
            // Display Data
            lobbyTitle.innerHTML = "Starting Cashier Shift: " + playerDetails.db.name + "...";
            lobbySessionListen(user.uid, changeVRReadyStatus)

        } catch (error) {
            console.error("Error fetching player details:", error);
        }
        } else {
        console.log("No user is logged in.");
        }
    });

    // Ready
    document.getElementById('readyBtn').addEventListener("click", () => {
        console.log("Ready Btn!")
        changeWebReadyStatus();
    });

    function changeWebReadyStatus() {
        if (webReadyStatus == false) {
            updateWebReadyStatus(true)
            webReadyStatus = true
            webReadyBG.classList.remove("bg-pink")
            webReadyBG.classList.add("bg-green")
            webReadyBG.classList.remove("text-cream")
            webReadyBG.classList.add("text-brown")
            readyBtn.innerHTML = "Waiting for VR Player.."
            webReadyStatusText.innerHTML = "READY"
            checkBothReady()
        } else {
            updateWebReadyStatus(false)
            webReadyStatus = false
            webReadyBG.classList.add("bg-pink")
            webReadyBG.classList.remove("bg-green")
            webReadyBG.classList.add("text-cream")
            webReadyBG.classList.remove("text-brown")
            readyBtn.innerHTML = "Ready"
            webReadyStatusText.innerHTML = "NOT READY"
        }
    }

    function changeVRReadyStatus(vrReadyStatus) {
        if (vrReadyStatus == true) {
            console.log("vr ready!")
            gameReadyStatus = true
            vrReadyBG.classList.remove("bg-pink")
            vrReadyBG.classList.add("bg-green")
            vrReadyBG.classList.remove("text-cream")
            vrReadyBG.classList.add("text-brown")
            vrReadyStatusText.innerHTML = "READY"
            checkBothReady()
        } else {
            gameReadyStatus = false
            console.log("vr not ready!")
            vrReadyBG.classList.add("bg-pink")
            vrReadyBG.classList.remove("bg-green")
            vrReadyBG.classList.add("text-cream")
            vrReadyBG.classList.remove("text-brown")
            vrReadyStatusText.innerHTML = "NOT READY"
        }
    }

    function checkBothReady() {
        if (gameReadyStatus == true && webReadyStatus == true) {
            window.location.href= "game.html"
        }
    }
})