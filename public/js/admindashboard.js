import { getNumberOfPlayers, getTotalShiftsCompleted, getTotalActiveSessions, getAllPlayersMistakesDistribution, getAllPlayersPerformanceMetrics, getPlayersList, getPlayerDetails}  from './DatabaseManager.js';

const body = document.getElementById('body')
const allPlayersMistakesMadeChart = document.getElementById('allPlayersMistakesMadeChart').getContext('2d');
const allPlayersPerformanceMetricsChart = document.getElementById('allPlayersPerformanceMetricsChart').getContext('2d');
const PlayerStatMistakesChart = document.getElementById('PlayerStatMistakesChart').getContext('2d');
const PlayerStatPerformanceChart = document.getElementById('PlayerStatPerformanceChart').getContext('2d');
const playerCountText = document.getElementById('playerCountText');
const activePlayersText = document.getElementById('activePlayersText');
const shiftsCompletedText = document.getElementById('shiftsCompletedText');

const overallAdminPanel = document.getElementById('overallAdminPanel')
const playersListPanel = document.getElementById('playersListPanel')
const playerStatPanel = document.getElementById('playerStatPanel')
const playersContainer = document.getElementById('playersContainer');

var allPlayersMistakesMadeChartInstance;
var allPlayersPerformanceMetricsChartInstance;
var PlayerStatMistakesChartInstance;
var PlayerStatPerformanceChartInstance;

getNumberOfPlayers((error, playerCount) => {
    if (error) {
        console.error("Error updating player count:", error);
        return;
    }
    playerCountText.innerHTML = playerCount;
});

getTotalActiveSessions((error, activeSessions) => {
    if (error) {
        console.error("Error updating active sessions: ", error);
        return;
    }
    activePlayersText.innerHTML = activeSessions;
});

getTotalShiftsCompleted((error, shiftsCompleted) => {
    if (error) {
        console.error("Error updating total shifts:", error);
        return;
    }
    shiftsCompletedText.innerHTML = shiftsCompleted;
});

// Chart JS Defaults
Chart.defaults.color = '#FFEEC3';
Chart.defaults.font.size = 15;
Chart.defaults.font.family = "Dynapuff";

getAllPlayersMistakesDistribution((mistakeCounts) => {
    if (allPlayersMistakesMadeChartInstance != null) {
        allPlayersMistakesMadeChartInstance.destroy();
    }
    allPlayersMistakesMadeChartInstance = new Chart(allPlayersMistakesMadeChart, {
        type: "pie",
        data: {
            labels: Object.keys(mistakeCounts),
            datasets: [{
                data: Object.values(mistakeCounts),
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)"
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
})

getAllPlayersPerformanceMetrics((playerNames, shiftsCompleted, customersServed, profitsEarned) => {
    if (allPlayersPerformanceMetricsChartInstance != null) {
        allPlayersPerformanceMetricsChartInstance.destroy();
    }
    allPlayersPerformanceMetricsChartInstance = new Chart(allPlayersPerformanceMetricsChart, {
        type: "bar",
            data: {
                labels: playerNames,
                datasets: [
                    {
                        label: "Shifts Completed",
                        data: shiftsCompleted,
                        backgroundColor: "rgba(75, 192, 192, 0.6)"
                    },
                    {
                        label: "Customers Served",
                        data: customersServed,
                        backgroundColor: "rgba(255, 159, 64, 0.6)"
                    },
                    {
                        label: "Profits Earned",
                        data: profitsEarned,
                        backgroundColor: "rgba(54, 162, 235, 0.6)"
                    }
                ]
            },
            options: {
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                },
                responsive: true,
                maintainAspectRatio: false
            }
    });

    getPlayersList((error, players) => {
        if (error) {
            console.error("Error updating player list:", error);
            return;
        }

        playersContainer.innerHTML = "";

        const playersArray = Object.values(players); // convert to array

        // sort by shiftsCompleted in descending order
        playersArray.sort((a, b) => b.shiftsCompleted - a.shiftsCompleted);

        for (const player of playersArray) {
            if (player.isAdmin === true) {
                continue; // skip admin players
            }

            const playerDiv = document.createElement('div');
            playerDiv.classList.add(
                'flex',
                'flex-col',
                'outline',
                'outline-2',
                'h-full',
                'outline-cream',
                'rounded-3xl',
                'p-9',
                'justify-center'
            );

            playerDiv.innerHTML = `
                <p class="text-3xl text-cream truncate pb-1">${player.name}</p>
                <p class="text-md text-cream truncate">High Score: ${player.highScore}</p>
                <p class="text-md text-cream truncate">Shifts Completed: ${player.shiftsCompleted}</p>
            `;

            playerDiv.addEventListener('click', () => showPlayerDetails(player));

            playersContainer.appendChild(playerDiv);
        }
    });    
})

function showPlayerDetails(player) {
    document.getElementById('playerStatName').innerText = "Player: "+ player.name;
    document.getElementById('profitsText').innerText = Math.round(player.profitsEarned * 100) / 100;
    document.getElementById('proficiencyText').innerText = player.
    proficiencyScore;
    document.getElementById('playerStatShiftsCompletedText').innerText = player.shiftsCompleted;
    document.getElementById('avgTimePerTxt').innerText = Math.round(player.averageTimePerTransaction * 100) / 100;

    if (PlayerStatMistakesChartInstance != null) {
        PlayerStatMistakesChartInstance.destroy();
    }

    if (PlayerStatPerformanceChartInstance != null) {
        PlayerStatPerformanceChartInstance.destroy();
    }

    PlayerStatMistakesChartInstance = new Chart(PlayerStatMistakesChart, {
        type: "bar",
        data: {
          labels: [
            "Overcharged", "Undercharged", "Excess Change", 
            "Insufficient Change", "Insufficient Payment", 
            "Invalid Rejections", "Restricted Sales", "Invalid ID"
          ],
          datasets: [{
            label: "Mistakes Made",
            data: [
              player.mistakesMade.customersOvercharged,
              player.mistakesMade.customersUndercharged,
              player.mistakesMade.excessChangeGiven,
              player.mistakesMade.insufficientChangeGiven,
              player.mistakesMade.insufficientCustomerPayment,
              player.mistakesMade.invalidRejections,
              player.mistakesMade.restrictedSalesToMinors,
              player.mistakesMade.transactionsToInvalidID
            ],
            backgroundColor: "#FFEEC3"
          }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    PlayerStatPerformanceChartInstance = new Chart(PlayerStatPerformanceChart, {
        type: "doughnut",
        data: {
            labels: ["High Score", "Remaining to Goal (10)"],
            datasets: [{
                data: [player.highScore, 10-player.highScore],
                backgroundColor: ["rgba(153, 102, 255, 0.6)", "rgba(200, 200, 200, 0.6)"]
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
  
    body.classList.add('overflow-hidden');
    playersListPanel.classList.add('hidden');
    playerStatPanel.classList.remove('hidden');

document.getElementById('playerStatCloseBtn').addEventListener('click', closeDetailPanel);
document.getElementById('playerListCloseBtn').addEventListener('click', closePlayersPanel);
document.getElementById('playersListBtn').addEventListener('click', openPlayersPanel);

function closeDetailPanel() {
    body.classList.remove('overflow-hidden');
    playersListPanel.classList.remove('hidden');
    playerStatPanel.classList.add('hidden');
}}

function openPlayersPanel() {
    body.classList.remove('overflow-hidden');
    playersListPanel.classList.remove('hidden');
    overallAdminPanel.classList.add('hidden');
}

function closePlayersPanel() {
    body.classList.add('overflow-hidden');
    playersListPanel.classList.add('hidden');
    overallAdminPanel.classList.remove('hidden');
}