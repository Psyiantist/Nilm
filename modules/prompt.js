const description = 'This command will answer anything that you will ask.';
const usage = '(prompt)';
const type = '4';

const dateTime = new Date();
const options = { timeZone: 'Asia/Manila', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

const philippineDateTime = new Intl.DateTimeFormat('en-PH', options).format(dateTime);

const axios = require('axios');

let event = JSON.parse(process.argv[2]),
    msg = event.body,
    prompt = msg.substring(msg.indexOf(" ") + 1);

const postData = [{
  role: "system",
  content: "You are Nilmar Bot, an AI designed by Matt Castaneda and Nilmar Yape to help people in their everyday lives and to answer any questions they may have."
},
{
  role: "user",
  content: `${prompt}`
}];

axios.post('https://kitsune.mattfawn.repl.co/llama70', postData)
  .then(response => {
    console.log(response.data.response);
  })
  .catch(error => {
    console.error(error);
  });