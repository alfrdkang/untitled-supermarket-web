import { auth, getPlayerDetails } from "./DatabaseManager.js";

const adminNavBtn = document.getElementById("adminNavBtn");

auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log("User is logged in with UID:", user.uid);
  
      try {
        const playerDetails = await getPlayerDetails(user.uid);
        if (playerDetails.db.isAdmin) {
            console.log("admin confirmed!")
            adminNavBtn.classList.remove("hidden")
        }

      } catch (error) {
        console.error("Error checking admin:", error);
      }
    } else {
      console.log("No user is logged in.");
    }
});