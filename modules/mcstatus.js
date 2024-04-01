const description = 'Get information about Minecraft servers quickly.';
const type = '0';
const usage = '(address:port)';

let event = JSON.parse(process.argv[2]),
    msg = event.body,
    server = msg.substring(msg.indexOf(" ") + 1);

async function main() {
const axios = require("axios");

const response = await axios.get(`https://api.mcsrvstat.us/bedrock/3/${server}`);
const data = response.data;
var status = response.data.online ? "Online 🟢" : "Offline 🔴";

  if (status == "Online 🟢") {
    const playersOnline = data.players.online;
    const maxPlayers = data.players.max;
    const version = data.version;
    const gamemode = data.gamemode;
    const serverId = data.serverid;
    const motd = data.motd.clean[0];

    if (motd == "Offline") status = "Offline 🔴";

    const output = `
Status: ${status}
Players: ${playersOnline}/${maxPlayers}

Version: ${version}
Gamemode: ${gamemode}
Server ID: ${serverId}

${motd}
    `;

    console.log(output);
} else {
  console.log('Status: Offline 🔴\n\nExample Usage: /mcstatus test.aternos.me:19132')
  }
}

main()