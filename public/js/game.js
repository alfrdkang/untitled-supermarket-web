import { getPlayerDetails, auth, gameSessionListen } from './DatabaseManager.js';

const ictitle = document.getElementById("ictitle")
const icserialno = document.getElementById("icserialno")
const icphoto = document.getElementById("icphoto")
const icname = document.getElementById("icname")
const icDOB = document.getElementById("icDOB")
const icCountry = document.getElementById("icCountry")
const icManufacturer = document.getElementById("icManufacturer")
const date = document.getElementById("date")

const mugshots = [
    "img/mugshots/doctor.png",
    "img/mugshots/fatman.png",
    "img/mugshots/george.png",
    "img/mugshots/karen.png",
    "img/mugshots/officer.png",
    "img/mugshots/sally.png"
];

auth.onAuthStateChanged(async (user) => {
    if (user) {
    console.log("User is logged in with UID:", user.uid);

    try {
        const playerDetails = await getPlayerDetails(user.uid);
        console.log("Player details:", playerDetails);

        // Display Data
        gameSessionListen(user.uid, displayCurrentCustomerID)

    } catch (error) {
        console.error("Error fetching player details:", error);
    }
    } else {
    console.log("No user is logged in.");
    }
});

function displayCurrentCustomerID(dateOfBirth, name, isFake, spriteIndex) {
    // Name
    icname.innerHTML = name;
    icDOB.innerHTML = dateOfBirth;
    
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    
    date.innerHTML = "Today's Date: " + `${year}/${month}/${day}`;

    // 12-digit Serial Number
    const randomSerialNo = Math.floor(Math.random() * 1e12).toString().padStart(12, '0');
    icserialno.innerHTML = randomSerialNo;

    // Photo
    if (spriteIndex >= 0 && spriteIndex < mugshots.length) {
        icphoto.src = mugshots[spriteIndex];
    } else {
        console.error("Invalid SpriteIndex");
    }

    // Correct IC Details
    ictitle.innerHTML = "Republic of Unionpire"
    icCountry.innerHTML = "Unionpire"
    icManufacturer.innerHTML = "Made by OrientIdentityOrg"
    
    // Handle Fake Id
    if (isFake) {
        const fakeModifications = {
            icTitle: "Replublic of Unionpire",
            icCountry: "Unionp1re", 
            icManufacturer: "Made by OrientIdenityOrg"
        };

        const keys = Object.keys(fakeModifications);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];    

        if (randomKey === "icTitle") {
            ictitle.innerHTML = fakeModifications.icTitle;
        } else if (randomKey === "icCountry") {
            icCountry.innerHTML = fakeModifications.icCountry;
        } else if (randomKey === "icManufacturer") {
            icManufacturer.innerHTML = fakeModifications.icManufacturer;
        }
    }
}
