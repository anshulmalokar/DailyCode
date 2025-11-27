🚀 Daily TypeScript & Async Practice - Day 2: Leaderboard Generator

This project showcases fundamental TypeScript concepts—Interfaces, Array Manipulation, and Asynchronous Programming—by simulating the generation of a ranked leaderboard.

🎯 Features

Asynchronous Data Fetching: Uses Promise and setTimeout to mock a 3-second network latency when retrieving raw user data.

Data Processing: Calculates the averageScore (totalPoints / gamesPlayed) for each user.

Ranking: Sorts the processed data in descending order of score and assigns a numerical rank.

async/await Flow: Demonstrates writing clean, sequential asynchronous logic using modern JavaScript/TypeScript syntax.

💾 Data Structures

Interface

Purpose

Key Fields

RawUserData

Data structure from the simulated API.

userId, username, totalPoints, gamesPlayed

LeaderboardEntry

Final, ranked, and processed output.

rank, username, averageScore

⚙️ Core Logic

The generateLeaderBoard function orchestrates the process:

await fetchRawUsersdata(): Pauses execution until data is available.

Data is transformed using .map() to calculate scores.

Data is sorted using .sort((a, b) => b.score - a.score).

Ranks are assigned during a final .map() iteration.