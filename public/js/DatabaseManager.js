import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { app } from './config.js';

const db = getDatabase(app);
const auth = getAuth(app);
const playerRef = ref(db, "players");

onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Logged-in UID:', user.uid);
    } else {
      console.log('No user is signed in.');
    }
  });

function createUser(username, email, password) {
    console.log("Creating the user...");
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User created successfully: ", JSON.stringify(user));

            // write user data to the database
            writeNewUser(user.uid, username, "", false, 0, 0, 0, 0, 0, 0);
        })
        .catch((error) => {
            console.error("Error creating user: ", handleAuthExceptions(error));
        });
}

function loginUser(email, password) {
    console.log("Logging in the user...");
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in successfully: ", JSON.stringify(user));
        })
        .catch((error) => {
            console.error("Error logging in: ", handleAuthExceptions(error));
        });
}

function writeNewUser(uid, name, storeName, isAdmin, shiftsCompleted, customersServed, itemsScanned, mistakesMade, profitsEarned, highScore) {
    const userRef = ref(db, `players/${uid}`);

    set(userRef, {
        name: name,
        storeName: storeName,
        isAdmin: isAdmin,
        shiftsCompleted: shiftsCompleted,
        customersServed: customersServed,
        itemsScanned: itemsScanned,
        mistakesMade: mistakesMade,
        profitsEarned: profitsEarned,
        highScore: highScore
    })
        .then(() => {
            console.log("User data successfully written!");
        })
        .catch((error) => {
            console.error("Error writing data: ", error);
        });
}

function resetPassword(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent successfully.");
        })
        .catch((error) => {
            console.error("Error resetting password: ", handleAuthExceptions(error));
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


async function getNumberOfPlayers() {
    const db = getDatabase();
    const playersRef = ref(db, 'players');
  
    try {
      const snapshot = await get(playersRef);
      if (snapshot.exists()) {
        const playersData = snapshot.val();

        const playerCount = Array.isArray(playersData)
          ? playersData.filter(player => player !== null).length
          : Object.keys(playersData).length;
        return playerCount;
      } else {
        console.log("No players found in the database.");
        return 0;
      }
    } catch (error) {
      console.error("Error fetching player data:", error);
      return 0;
    }
}

async function getTotalShiftsCompleted() {
  const db = getDatabase();
  const playersRef = ref(db, 'players');

  try {
    const snapshot = await get(playersRef);
    if (snapshot.exists()) {
      const playersData = snapshot.val();
      let totalShiftsCompleted = 0;

      for (const userId in playersData) {
        const player = playersData[userId];
        if (player.shiftsCompleted) {
          totalShiftsCompleted += player.shiftsCompleted;
        }
      }

      return totalShiftsCompleted;
    } else {
      console.log("No player data found.");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching player data:", error);
    return 0;
  }
}

async function getPlayerDetails(uid) {
    try {
        // Fetch user authentication details from Firebase Auth (client-side)
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || user.uid !== uid) {
            throw new Error("User is not authenticated or UID does not match the current user");
        }

        // Fetch user details from Realtime Database (client-side)
        const db = getDatabase();
        const dbRef = ref(db, `players/${uid}`);
        const dbSnapshot = await get(dbRef);
        
        if (!dbSnapshot.exists()) {
            throw new Error(`No database details found for UID: ${uid}`);
        }

        return {
            auth: {
                uid: user.uid,
                email: user.email,
            },
            db: dbSnapshot.val(),
        };
    } catch (error) {
        console.error(`Error fetching player details for UID: ${uid}`, error);
        throw error;
    }
}

// Account Validation Function
function handleAuthExceptions(error) {
    let validationText = "";

    if (!error) {
        validationText += "Unknown error occurred.";
        return validationText;
    }

    // Firebase error codes
    const errorCode = error.code; // Firebase error code
    console.error("Error in auth.... error code: " + errorCode);

    switch (errorCode) {
        case 'auth/missing-email':
            validationText += "Email field cannot be blank.";
            break;
        case 'auth/internal-error': // often caused by missing password apparently
            validationText += "Password field cannot be blank.";
            break;
        case 'auth/wrong-password':
            validationText += "Wrong Password";
            break;
        case 'auth/user-not-found':
            validationText += "User does not exist, please create an account";
            break;
        case 'auth/invalid-email':
            validationText += "Invalid Email";
            break;
        case 'auth/weak-password':
            validationText += "Weak Password (Minimum 8 Characters, requires upper case letters, lower case letters, numbers)";
            break;
        case 'auth/email-already-in-use':
            validationText += "Email is already in use, try logging in";
            break;
        case 'auth/user-mismatch':
            validationText += "User Mismatch";
            break;
        default:
            validationText += "Issue in authentication: " + errorCode;
            break;
    }

    return validationText;
}


export { auth, createUser, loginUser, resetPassword, getNumberOfPlayers, getTotalShiftsCompleted, getPlayerDetails }