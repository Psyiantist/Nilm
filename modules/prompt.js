const description = 'This command will answer anything that you will ask.';
const usage = '(prompt)';
const type = '4';

const axios = require('axios');

let event = JSON.parse(process.argv[2]),
    msg = event.body,
    prompt = msg.substring(msg.indexOf(" ") + 1);

const postData = {
    "messages": 
    {
        "role":
            "user", "parts":
            ["Pretend that you are Nilmar Bot an AI created by Nilmar Yape and Matt Castaneda."]
    },
    {
        "role":
            "model", "parts":
            ["Okay. I am Nilmar Bot an Artificial Intelligence created by Nilmar Yape and Matt Castaneda."]
    },
    {
        "role":
            "model", "parts":
            [prompt]
    }
}

axios.post('nilmaryape123.pythonanywhere.com/get_answer', postData)
  .then(response => {
    console.log(response.data.answer);
  })
  .catch(error => {
    console.error(error);
  });
