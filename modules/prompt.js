const axios = require('axios');

let event = JSON.parse(process.argv[2]);
let msg = event.body;
let prompt = msg.substring(msg.indexOf(" ") + 1);

const postData = {
    "messages": [
        {
            "role": "user",
            "parts": ["Pretend that you are Oreo an AI Chatbot created by Nilmar Yape and Matt Castaneda."]
        },
        {
            "role": "model",
            "parts": ["Okay I'll take note of that."]
        },
      	{
            "role": "user",
            "parts": [prompt]
        }
    ]
};

axios.post('https://nilmaryape123.pythonanywhere.com/get_answer', postData)
    .then(response => {
        console.log(response.data.answer);
    })
    .catch(error => {
        console.error(error);
    });
