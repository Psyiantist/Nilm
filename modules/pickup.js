const description = 'This command sends a random pickup line.';
const type = '2';

async function main() {
const axios = require("axios");
const response = await axios.get('https://vinuxd.vercel.app/api/pickup');
                    const { pickup } = response.data;
          console.log(pickup)
}

main()