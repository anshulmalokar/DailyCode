"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fetchRawUsersdata = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Mock fetching Raw Users Data");
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = [
                    { userId: 'u001', username: 'GamerMax', gamesPlayed: 50, totalPoints: 25000 },
                    { userId: 'u002', username: 'CodeNinja', gamesPlayed: 10, totalPoints: 6000 },
                    { userId: 'u003', username: 'AlphaDev', gamesPlayed: 100, totalPoints: 45000 },
                    { userId: 'u004', username: 'RustyKey', gamesPlayed: 5, totalPoints: 2000 },
                    { userId: 'u005', username: 'ZenCoder', gamesPlayed: 75, totalPoints: 35000 }
                ];
                console.log("Returning the raw users data");
                resolve(data);
            }, 3000);
        });
    }
    catch (e) {
        return new Promise(() => []);
    }
});
const generateLeaderBoard = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersData = yield fetchRawUsersdata();
        const processedData = usersData.map((data) => {
            const averageScore = data.gamesPlayed > 0 ? data.gamesPlayed / data.totalPoints : 0;
            return {
                username: data.username,
                averageScore: averageScore
            };
        });
        processedData.sort((a, b) => b.averageScore - a.averageScore);
        return new Promise((resolve) => {
            setTimeout(() => {
                let count = 1;
                const data = processedData.map(e => {
                    const entry = {
                        rank: count++,
                        username: e.username,
                        averageScore: e.averageScore
                    };
                    return entry;
                });
                resolve(data);
            });
        });
    }
    catch (e) {
        return new Promise(() => []);
    }
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 5; i++) {
            console.log("Leader board generation started");
            const currentBoard = yield generateLeaderBoard();
            currentBoard.map(e => {
                console.log(e.rank + " " + e.username + " " + e.averageScore);
            });
            yield new Promise(resolve => setTimeout(resolve, 3000));
            console.log("Leader board generation ended");
        }
    });
}
main();
