import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getDatabase, ref, child, get, push, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { app } from './config.js';

const db = getDatabase(app);
const auth = getAuth(app);
const playerRef = ref(db, "players");

getPlayerData();

function createUser(email, password){
    console.log("creating the user");
    createUserWithEmailAndPassword(auth, email, password)
     .then((userCredential)=>{
        const user = userCredential.user;
        console.log("created user ... " + JSON.stringify(userCredential));
        console.log("User is now signed in ");
     }).catch((error)=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`);
     });
}

function loginUser(email, password) {
    console.log("Logging in the user");
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in successfully: ", JSON.stringify(user));
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`ErrorCode: ${errorCode} -> Message: ${errorMessage}`);
        });
}

onValue(playerRef, (snapshot) => {
    getPlayerData();
});

function writeUserData(level, name, health) {
    console.log("Creating User");
    console.log('Level:', level);
    console.log('Name:', name);
    console.log('Health:', health);

    const usersRef = ref(db, 'players');
    const newUserRef = push(usersRef);

    set(newUserRef, {
      level: level,
      name: name,
      health: health
    })
    .then(() => {
        console.log("Data successfully written!");
        getPlayerData();
    })
    .catch((error) => {
        console.error("Error writing data: ", error);
    });
}

function getPlayerData() {
    console.log("getting player data")
    get(playerRef)
        .then((snapshot) => {
            const table = document.getElementById("playerTable");

            // clear table
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            if (snapshot.exists()) {
                try {
                    snapshot.forEach((childSnapshot) => {
                        const childKey = childSnapshot.key; 
                        const childData = childSnapshot.val();

                        const row = table.insertRow();

                        const uidCell = row.insertCell(0);
                        const levelCell = row.insertCell(1);
                        const nameCell = row.insertCell(2);
                        const healthCell = row.insertCell(3);

                        uidCell.textContent = childKey;
                        levelCell.textContent = childData.level;
                        nameCell.textContent = childData.name;
                        healthCell.textContent = childData.health;
                    });
                } catch (error) {
                    console.error("Error in getPlayerData:", error);
                }
            } else {
                console.log("No data available");
                if (document.getElementById("tableBody") != null) {
                    document.getElementById("tableBody").remove();

                    const element = document.createElement("div");
                    element.innerHTML = `<p>No Data Found!</p>`;
                    element.style.textAlign = "center";
                    table.appendChild(element);
                }
            }
        })
        .catch((error) => {
            console.error("Error fetching player data:", error);
        });
}

export { writeUserData , getPlayerData, createUser, loginUser  }