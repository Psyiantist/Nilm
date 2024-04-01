const description = 'This command will retrieve your TETR.IO account info.';
const usage = '(username)';
const type = '1';

const axios = require('axios');

let event = JSON.parse(process.argv[2]),
    msg = event.body,
    username = encodeURI(msg.substring(msg.indexOf(" ") + 1).toLowerCase());

axios.get(`https://ch.tetr.io/api/users/${username}`)
  .then(response => {
    console.log(`USERNAME: ${response.data.data.user.username.toUpperCase()}
ID: ${response.data.data.user._id}
COUNTRY: ${response.data.data.user.country}
XP: ${response.data.data.user.xp}
GAMES PLAYED: ${response.data.data.user.gamesplayed}
GAMES WON: ${response.data.data.user.gameswon}

🏆 LEAGUE 🏆
Rank: ${response.data.data.user.league.rank}
Best rank: ${response.data.data.user.league.bestrank}
Standing: ${response.data.data.user.league.standing}
Standing (local): ${response.data.data.user.league.standing_local}
Games played: ${response.data.data.user.league.gamesplayed}
Games won: ${response.data.data.user.league.gameswon}
Rating: ${response.data.data.user.league.rating}
    `);
  })
  .catch(error => {
    console.error(error);
  });

