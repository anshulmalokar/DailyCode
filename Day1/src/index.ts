interface RawUsersData{
    userId: String,
    username: String,
    totalPoints: number,
    gamesPlayed: number,
}

interface LeaderboardEntry{
    rank: Number,
    username: string,
    averageScore: Number
}

const fetchRawUsersdata = async (): Promise<RawUsersData[]> => {
    console.log("Mock fetching Raw Users Data");
    try{
        return new Promise<RawUsersData[]>((resolve) => {
            setTimeout(() => {
                const data: RawUsersData[] = [
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
    }catch(e){
        return new Promise(() => []);
    }
}

const generateLeaderBoard = async():Promise<LeaderboardEntry[]> => {
    try{
        const usersData: RawUsersData[] = await fetchRawUsersdata();
        const processedData = usersData.map((data: RawUsersData) => {
            const averageScore = data.gamesPlayed > 0 ? data.gamesPlayed/data.totalPoints : 0;
            return {
                username: data.username,
                averageScore: averageScore
            }
        });

        processedData.sort((a,b) => b.averageScore - a.averageScore);

        return new Promise<LeaderboardEntry[]>((resolve) => {
            setTimeout(() => {
                let count = 1;
                const data: LeaderboardEntry[] = processedData.map(e => {
                    const entry: LeaderboardEntry = {
                        rank: count++,
                        username: e.username as string,
                        averageScore: e.averageScore
                    }
                    return entry;
                });
                resolve(data);
            })
        });
    }catch(e){
        return new Promise(() => []);
    }
}


async function main(){
    for(let i=0; i<5; i++){
        console.log("Leader board generation started");
        const currentBoard: LeaderboardEntry[] = await generateLeaderBoard();
        currentBoard.map(e => {
            console.log(e.rank + " " + e.username + " " + e.averageScore);
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("Leader board generation ended");
    }
}

main();