# untitled-supermarket-web
## DDA-ASG2
> **Date Created: 6/12/24
Date Last Modified: 14/12/24**
> 
---

# Introduction

## Theme:

Supermarket

## Name:

Untitled Supermarket Simulator

## Description

**Untitled Supermarket Simulator** is an engaging cashier simulation game designed for students, young adults, and job-seekers. Set in a realistic supermarket environment, players handle tasks like scanning items, calculating totals, and processing payments. The game promotes skills such as math, time management, and customer service through interactive, progression-based challenges. Features like error detection, performance tracking, and multiplayer modes make it ideal for education, casual play, and professional training. Employers and trainers can use built-in analytics to assess player proficiency, blending entertainment with real-world skill development.

# Purpose

## Target Audience

### People (Ages 10-28) or Job-Seekers and Training Professionals

The **target audience** for a cashier simulator game includes **students (10-18)**, **young adults (18-28)**, and **job-seekers/training professionals**. For students, it serves as an engaging educational tool to teach math, financial literacy, and time management while introducing job responsibilities in a fun and interactive way. Young adults, particularly casual gamers, enjoy its progression-based mechanics, while those exploring retail careers can use it to build confidence and gain practical experience.

For **job-seekers** and **training professionals**, the simulator acts as a hands-on tool for skill development and onboarding. It provides realistic practice in managing transactions, improving accuracy, and handling customer interactions. Employers and trainers can use built-in performance metrics like transaction speed and error rates to assess proficiency. By combining **education, training, and entertainment**, the game appeals to a broad audience, bridging learning with practical skill-building.

## Supermarket Simulator

The **supermarket simulator** theme is both relatable and practical, making it appealing to a broad audience. Supermarkets are a familiar, everyday environment, allowing players to easily connect with the gameplay and understand tasks like scanning items, calculating totals, and managing transactions. This familiarity creates an immersive experience that teaches valuable real-world skills such as math accuracy, time management, multitasking, and customer interaction.

The supermarket setting also provides engaging, goal-driven gameplay. Players can progress by improving efficiency, reducing errors, and unlocking rewards such as upgraded tools or new challenges. This combination of realism, skill-building, and progression keeps players motivated while delivering a fun and meaningful experience.

# Game Mechanics

## Items

- Canned Tuna ($3.55)
- Milk ($5.50)
- Yogurt ($3.00)
- Biscuits ($3.50)
- Rice ($6.00)
- Pasta ($2.00)
- Flour ($2.50)
- Sugar ($3.00)
- Water ($1.50)
- Bottled Drinks ($2.50)
- Chocolate ($5.50)
- Cookies ($7.00)
- Juice ($4.50)
- Wine ($30.00)
- Cigarettes ($10.00)

## Cash register slots

- Dollar notes:
    - 1
    - 2
    - 5
    - 10
    - 20
- Coins:
    - 0.01
    - 0.05
    - 0.10
    - 0.20
    - 0.50

## Features

- Authentication
    - Sign Up for Account
    - Login to Account
    - Customized Email Password Reset
    - Input Validation
- 404 Page
    - Redirect to login page button
- Lobby Page
    - Syncing of game sessions
    - Waits for both parties to be ready
- Game Page
    - Shows current paying customer’s ID
    - If ID is fake, displays typo in random field of ID
- Admin Page
    - ONLY available if user signs in with admin account
    - Game Admin Panel
        - Total Number of Players
        - Total Number of **Active** Players
        - Total Shifts Completed
        - Pie Chart showcasing deviations of varying Mistakes Made
        - Stacked Bar Graph showcasing shifts completed, customers served, and profits earned for every player with valid data
    - Players List
        - Creates button for every player in the database, showing their name, highscore, and shifts completed
    - Player Stat Panel
        - Profits Earned
        - Proficiency Score
        - Shifts Completed
        - Average Time Per Transaction
        - Bar chart showcasing deviation of mistakes made by player
        - Doughnut chart showing how far the player is from the standard
            - Useful for recruiters to figure out whether the player is fit for the job
- Leaderboard
    - High Score Sort
    - Proficiency Sort
    - Total Profits Earned Sort
    - Average Time Per Transaction Sort
- Settings
    - Account
        - Change Username
        - Change Email
        - Change Password
        - Delete Account
        - Log out
    - Store
        - Store Name

# Database / Data Modelling

## Database Structure

- Root
    - Players
        - UID
            - name
            - storeName
            - isAdmin
            - shiftsCompleted
            - customersServed
            - itemsScanned
            - mistakesMade
                - excessChangeGiven
                - insufficientChangeGiven
                - customersOvercharged (full refund)
                - customersUndercharged
                - insufficientCustomerPayment
                - invalidRejections
                - restrictedSalesToMinors
                - transactionsToInvalidID
            - profitsEarned
            - highScore (highest profit in single shift)
            - proficiencyScore (customersServed / (mistakesMade * averageTimePerTranscation) * 100)
            - averageTimePerTransaction(seconds)
    - sessions
        - UID
            - gameConnected
            - webConnected
            - customer
            - dateOfBirth
            - fullName
            - isUnderage
            - isFake
            - shoppingList

## Database Planning

When designing the database structure for this project, we organized the data into two main root nodes: **players** and **sessions**. This setup ensures that the data is logically grouped and optimized for performance and scalability.

### Players

The **players** node is organized by unique user IDs (UIDs), which are synced with the authentication system. This integration simplifies data management and retrieval. Player data is primarily used in the admin dashboard to analyze performance and support informed decision-making by employers and recruiters.

### Sessions

The **sessions** node tracks active gameplay data, capturing essential details about ongoing multiplayer playthroughs. Each session is linked to a player's UID and includes information necessary for smooth gameplay and real-time tracking.

By structuring the database in this way, we ensure a seamless and efficient backend that supports both gameplay functionality and administrative data analysis.

# Wireframes / Game Flow

https://www.figma.com/design/1XSpA9Eu2JbGRSnRCqqpoq/Assg2_Prototype?node-id=25-37&t=MuOjHlwhs22GydPe-1

# Limitations, Bugs, and Future Implementations

## Bugs

- Users are able to guess my Firebase path and push to it if I do not change the permission settings on my Realtime Database soon
- Firebase Login sometimes does not go through

## Future Implementations

- Achievements
- Random Events (Shoplifting, impatient customer…etc)
- Restocking of shelves
- Voice Chat
- Multiplayer VR
- HUD

# References

## Website

## Font

### Dynapuff Font

https://fonts.google.com/specimen/DynaPuff

## Icons

### FontAwesome

https://fontawesome.com/

## CSS Framework

### TailwindCSS

https://tailwindcss.com/

## Unity VR Game

**Scanner beep**: https://pixabay.com/sound-effects/store-scanner-beep-90395/

**NPC's**: https://assetstore.unity.com/packages/3d/characters/city-people-free-samples-260446

**Grocery store**: https://assetstore.unity.com/packages/3d/environments/grocery-store-203239

**Barcode scanner**: https://free3d.com/3d-model/barcode-scanner-88269.html

**Money**: https://sketchfab.com/3d-models/free--money-currency-basic-pack-4368d88ee80f453dbbdbf78784bc32ad

**Wine bottle**: https://sketchfab.com/3d-models/wine-bottle-2303628f0243427bbe81c51dda60aab4

**Cigarette pack**: https://sketchfab.com/3d-models/marlboro-cigarettes-b8e612ccdb634e6388eeaf87ffbd46b3

**Door model**: https://sketchfab.com/3d-models/double-doors-with-windows-79ebb7d7e2ec415b9320f4680440ed0e

**Money font**: https://www.fontspace.com/dollar-bill-font-f18945

**Supermarket title**: https://www.fontspace.com/toysans-font-f22064