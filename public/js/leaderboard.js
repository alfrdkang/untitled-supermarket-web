import { getLeaderboardData } from './DatabaseManager.js';

// Leaderboard Page Switching
function switchContainer(activeBtnId, activeSectionId, allBtns, allSections) {
    // Nav btn Border
    allBtns.forEach(btn => {
        document.getElementById(btn).classList.add("border-transparent");
    });

    document.getElementById(activeBtnId).classList.remove("border-transparent");

    // Hide all sections
    allSections.forEach(section => {
        document.getElementById(section).classList.add("hidden");
    });

    // Show the selected section
    document.getElementById(activeSectionId).classList.remove("hidden");
}

document.getElementById('hScoreLeaderboardBtn').addEventListener("click", () => {
    switchContainer('hScoreLeaderboardBtn', 'hScoreLeaderboardContainer', 
        ['hScoreLeaderboardBtn', 'proficiencyLeaderboardBtn', 'profitsEarnedBtn', 'averageTimePerTxtBtn'], 
        ['hScoreLeaderboardContainer', 'proficiencyLeaderboardContainer', 'profitsEarnedContainer', 'averageTimePerTxtContainer']);
    getLeaderboardData("highScore", updateLeaderboard);
});

document.getElementById('proficiencyLeaderboardBtn').addEventListener("click", () => {
    switchContainer('proficiencyLeaderboardBtn', 'proficiencyLeaderboardContainer', 
        ['hScoreLeaderboardBtn', 'proficiencyLeaderboardBtn', 'profitsEarnedBtn', 'averageTimePerTxtBtn'], 
        ['hScoreLeaderboardContainer', 'proficiencyLeaderboardContainer', 'profitsEarnedContainer', 'averageTimePerTxtContainer']);
    getLeaderboardData("proficiencyScore", updateLeaderboard);
});

document.getElementById('profitsEarnedBtn').addEventListener("click", () => {
    switchContainer('profitsEarnedBtn', 'profitsEarnedContainer', 
        ['hScoreLeaderboardBtn', 'proficiencyLeaderboardBtn', 'profitsEarnedBtn', 'averageTimePerTxtBtn'], 
        ['hScoreLeaderboardContainer', 'proficiencyLeaderboardContainer', 'profitsEarnedContainer', 'averageTimePerTxtContainer']);
    getLeaderboardData("profitsEarned", updateLeaderboard);
});

document.getElementById('averageTimePerTxtBtn').addEventListener("click", () => {
    switchContainer('averageTimePerTxtBtn', 'averageTimePerTxtContainer', 
        ['hScoreLeaderboardBtn', 'proficiencyLeaderboardBtn', 'profitsEarnedBtn', 'averageTimePerTxtBtn'], 
        ['hScoreLeaderboardContainer', 'proficiencyLeaderboardContainer', 'profitsEarnedContainer', 'averageTimePerTxtContainer']);
    getLeaderboardData("averageTimePerTransaction", updateLeaderboard);
});

export function updateLeaderboard(snapshot, sort) {
    const players = [];
    snapshot.forEach((childSnapshot) => {
        const playerData = childSnapshot.val();
        players.push({
            name: playerData.name,
            stat: playerData[sort],
        });
    });

    players.reverse();

    const leaderboard = document.getElementById(sort+"Leaderboard");
    leaderboard.innerHTML = "";

    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        const playerEntry = document.createElement("div");
        playerEntry.className = "flex items-center justify-between py-5 border-b";

        const nameSpan = document.createElement("span");
        nameSpan.className = "text-white text-2xl";
        nameSpan.textContent = `${i + 1}. ${player.name}`;

        const statSpan = document.createElement("span");
        statSpan.className = "text-white text-2xl font-bold";
        statSpan.textContent = player.stat;

        playerEntry.appendChild(nameSpan);
        playerEntry.appendChild(statSpan);

        leaderboard.appendChild(playerEntry);
    }
}

getLeaderboardData("highScore", updateLeaderboard);
