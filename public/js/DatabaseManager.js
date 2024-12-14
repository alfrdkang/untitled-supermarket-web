import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateEmail, updatePassword, signOut, deleteUser, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getDatabase, child, ref, set, get, push, update, remove, onValue, orderByChild, query } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { app } from './config.js';

const db = getDatabase(app);
const auth = getAuth(app);
const playerRef = ref(db, "players");

onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Logged-in UID:', user.uid);
      console.log("moving you to lobby...")
      // Run onboarding.js function if it is loaded
      if (typeof switchToLobby === 'function') {
        switchToLobby();
      }
    } else {
      console.log('No user is signed in.');
    }
  });

async function createUser(username, email, password) {
    console.log("Creating the user...");
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User created successfully: ", JSON.stringify(user));

            // write user data to the database
            writeNewUser(user.uid, username, "", false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

            return true
        })
        .catch((error) => {
            console.error("Error creating user: ", handleAuthExceptions(error));

            return false
        });
}

async function loginUser(email, password) {
    console.log("Logging in the user...");
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in successfully: ", JSON.stringify(user));

            return true
        })
        .catch((error) => {
            console.error("Error logging in: ", handleAuthExceptions(error));

            return false
        });
}

async function changeEmail(email) {
    updateEmail(auth.currentUser, email)
    .then(() => {
        console.log("Email updated successfully: ", JSON.stringify(user));
    }).catch((error) => {
        console.error("Error changing email: ", handleAuthExceptions(error));
    });
}

async function changePassword(password) {
    updatePassword(auth.currentUser, password)
    .then(() => {
        console.log("Password updated successfully: ", JSON.stringify(user));
    }).catch((error) => {
        console.error("Error changing password: ", handleAuthExceptions(error));
    });
}

async function changeUsername(username) {
    const updateData = {
      username: username
    };
  
    const updates = {};
    updates['/players/' + auth.currentUser.uid + '/name'] = username;
  
    return update(ref(db), updates);
}

async function reauthenticateAuth(email, password) {
    var credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password
      );
            
      user.reauthenticateWithCredential(credential)
      .then(() => {
        console.log("Reauthentication Successful: ", JSON.stringify(user));
        return true
    }).catch((error) => {
        console.error("Reauthentication Unsuccessful: ", handleAuthExceptions(error));
        return false
    });
}

async function logoutAccount() {
  signOut(auth).then(() => {
    console.log("User signed out!")

    return true
  }).catch((error) => {
    console.error("Logout Unsuccessful: ", handleAuthExceptions(error));

    return false
});
}

async function deleteAccount() {
    // Delete Auth Account
    deleteUser(auth.currentUser).then(() => {
        console.log("account deleted")
      }).catch((error) => {
        console.error("Reauthentication Unsuccessful: ", handleAuthExceptions(error));
    });

    //Delete Db Account
    uid = auth.currentUser.uid
    try {
      await remove(ref(db, `players/${uid}`));
      console.log(`Player data with ID ${uid} has been deleted.`);
    } catch (error) {
      console.error("Error deleting player data:", error);
    }
}

function writeNewUser(uid, name, storeName, isAdmin, shiftsCompleted, customersServed, itemsScanned, profitsEarned, highScore, proficiencyScore, averageTimePerTransaction, restrictedSalesToMinors, excessChangeGiven, insufficientChangeGiven, customersOvercharged, customersUndercharged, insufficientCustomerPayment) {
    const userRef = ref(db, `players/${uid}`);

    set(userRef, {
        name: name,
        storeName: storeName,
        isAdmin: isAdmin,
        shiftsCompleted: shiftsCompleted,
        customersServed: customersServed,
        itemsScanned: itemsScanned,
        profitsEarned: profitsEarned,
        highScore: highScore,
        proficiencyScore: proficiencyScore,
        averageTimePerTransaction: averageTimePerTransaction,
        mistakesMade: {
            restrictedSalesToMinors: restrictedSalesToMinors,
            excessChangeGiven: excessChangeGiven,
            insufficientChangeGiven: insufficientChangeGiven,
            customersOvercharged: customersOvercharged,
            customersUndercharged: customersUndercharged,
            insufficientCustomerPayment: insufficientCustomerPayment
        },
    })
        .then(() => {
            console.log("User data successfully written!");
        })
        .catch((error) => {
            console.error("Error writing data: ", error);
        });
}

async function resetPassword(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Password reset email sent successfully.");
        })
        .catch((error) => {
            console.error("Error resetting password: ", handleAuthExceptions(error));
        });
}

async function getPlayerData() {
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

function getNumberOfPlayers(callback) {
  const db = getDatabase();
  const playersRef = ref(db, 'players');

  onValue(
    playersRef,
    (snapshot) => {
        if (snapshot.exists()) {
            const playerCount = Object.keys(snapshot.val()).length;
            callback(null, playerCount);
        } else {
            console.log("No players found in the database.");
            callback(null, 0); // No players found
        }
    },
    (error) => {
        console.error("Error fetching player data:", error);
        callback(error, null);
    }
  );
}

export function getPlayersList(callback) {
  const db = getDatabase();
  const playersRef = ref(db, 'players');

  onValue(
    playersRef,
    (snapshot) => {
        if (snapshot.exists()) {
            callback(null, snapshot.val());
        } else {
            console.log("No players found in the database.");
            callback(null, null); // No players found
        }
    },
    (error) => {
        console.error("Error fetching player list:", error);
        callback(error, null);
    }
  );
}

function getTotalShiftsCompleted(callback) {
  const db = getDatabase();
  const playersRef = ref(db, 'players');

  onValue(
      playersRef,
      (snapshot) => {
          if (snapshot.exists()) {
              const playersData = snapshot.val();
              let totalShiftsCompleted = 0;

              for (const userId in playersData) {
                  const player = playersData[userId];
                  if (player.shiftsCompleted) {
                      totalShiftsCompleted += player.shiftsCompleted;
                  }
              }

              callback(null, totalShiftsCompleted);
          } else {
              console.log("No player data found.");
              callback(null, 0); // No shifts completed
          }
      },
      (error) => {
          console.error("Error fetching player data:", error);
          callback(error, null);
      }
  );
}


export function getTotalActiveSessions(callback) {
  console.log("Getting total active sessions!");
  const sessionsRef = ref(db, 'sessions');

  onValue(
      sessionsRef,
      (snapshot) => {
          const childCount = snapshot.size || Object.keys(snapshot.val() || {}).length;
          callback(null, childCount);
      },
      (error) => {
          console.error("Error fetching data: ", error);
          callback(error, null);
      }
  );
}

export function getAllPlayersMistakesDistribution(callback) {
  const playersRef = ref(db, 'players');

  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
    const mistakeCounts = {};

    for (const playerId in data) {
        const mistakes = data[playerId].mistakesMade || {};
        for (const key in mistakes) {
            mistakeCounts[key] = (mistakeCounts[key] || 0) + mistakes[key];
        }
    }
    callback(mistakeCounts);
  })
}

export function getAllPlayersPerformanceMetrics(callback) {
  const playersRef = ref(db, 'players');

  onValue(playersRef, (snapshot) => {
    const data = snapshot.val();
        const playerNames = [];
        const shiftsCompleted = [];
        const customersServed = [];
        const profitsEarned = [];

        for (const playerId in data) {
            const player = data[playerId];
            if (player.shiftsCompleted != 0 && player.shiftsCompleted != null) {
              playerNames.push(player.name || "UndefinedName");
              shiftsCompleted.push(player.shiftsCompleted || 0);
              customersServed.push(player.customersServed || 0);
              profitsEarned.push(player.profitsEarned || 0);
            }
    }
    callback(playerNames, shiftsCompleted, customersServed, profitsEarned);
  })
}

async function getPlayerDetails(uid) {
    try {
        const user = auth.currentUser;

        if (!user || user.uid !== uid) {
            throw new Error("User is not authenticated or UID does not match the current user");
        }

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

async function lobbySessionListen(uid, changeVRReadyStatus) {
    const sessionRef = ref(db, `sessions/${uid}`);
  
    try {
      const snapshot = await get(sessionRef);
      if (!snapshot.exists()) {
        console.log("Session does not exist. Creating it...");
        set(sessionRef, { 
          createdOn: convertNowToTimestamp(), 
          currentCustomerIndex: 0,
          gameConnected: false,
          webConnected: false,
          timeElapsed: 0
        });
        console.log("Session created successfully.");
      } else {
        console.log("Session already exists.");
      }
  
      onValue(sessionRef, (snapshot) => {
        if (snapshot.exists()) {
            console.log("Session data changed:", snapshot.val());
            changeVRReadyStatus(snapshot.child("gameConnected").val());
        } else {
          console.log("Session data has been deleted.");
        }
      }, (error) => {
        console.error("Error listening for changes:", error);
      });
  
    } catch (error) {
      console.error("Error checking or creating session:", error);
    }
}

async function updateWebReadyStatus(status) {
  const updateData = {
    webConnected: status
  };

  const updates = {};
  updates['/sessions/' + auth.currentUser.uid + '/webConnected'] = status;

  return update(ref(db), updates);
}

async function gameSessionListen(uid, displayCurrentCustomerID) {
  const sessionRef = ref(db, `sessions/${uid}/customer`);

  try {
    const snapshot = await get(sessionRef);
    if (!snapshot.exists()) {
      console.log("Session does not exist. Creating it...");
      set(sessionRef, { 
        createdOn: convertNowToTimestamp(), 
        currentCustomerIndex: 0,
        gameConnected: false,
        webConnected: false,
        timeElapsed: 0
      });
      console.log("Session created successfully.");
    } else {
      console.log("Session already exists.");
    }

    onValue(sessionRef, (snapshot) => {
      if (snapshot.exists()) {
          console.log("Session data changed:", snapshot.val());
          displayCurrentCustomerID(
            snapshot.child("dateOfBirth").val(),
            snapshot.child("fullName").val(),
            snapshot.child("isFake").val(),
            snapshot.child("spriteIndex").val(),
          );
      } else {
        console.log("Session data has been deleted.");
      }
    }, (error) => {
      console.error("Error listening for changes:", error);
    });

  } catch (error) {
    console.error("Error checking or creating session:", error);
  }
}

async function getLeaderboardData(sort, updateLeaderboard) {  
    // Define the query based on the "sort" parameter
    const playersQuery = query(playerRef, orderByChild(sort));
  
    // Use async/await with the onValue function to fetch data
    onValue(playersQuery, (snapshot) => {
      if (snapshot.exists()) {
        updateLeaderboard(snapshot, sort);
      } else {
        console.error("No data available");
      }
    });
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

function convertNowToTimestamp() {
    const now = new Date();
    const timestamp = Math.floor(now.getTime() / 1000);
    return timestamp.toString();
}

export { auth, createUser, loginUser, resetPassword, getNumberOfPlayers, getTotalShiftsCompleted, getPlayerDetails, changeUsername, changeEmail, changePassword, reauthenticateAuth, logoutAccount, deleteAccount, lobbySessionListen, gameSessionListen, getLeaderboardData, updateWebReadyStatus }