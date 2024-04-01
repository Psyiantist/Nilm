const description = 'This command sends a random Sigma qoutes.';
const type = '2';

async function main() {
const axios = require("axios");
const response = await axios.get('https://sigma-male-grindset-api.vercel.app/api/quotes');
quote = `${response.data.quote}

-${response.data.author}`;
	
console.log(JSON.stringify({
				"body": quote,
        "attachment": "./templates/sigma.gif"
    }));
}

main();