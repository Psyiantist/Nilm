const axios = require('axios');

let event = JSON.parse(process.argv[2]);
let msg = event.body;
let prompt = msg.substring(msg.indexOf(" ") + 1);

const postData = {
    "messages": [
        {
            "role": "user",
            "parts": ["Pretend that you are Nilmar Bot, an AI created by Nilmar Yape and Matt Castaneda."]
        },
        {
            "role": "model",
            "parts": ["Okay. I am Nilmar Bot, an Artificial Intelligence created by Nilmar Yape and Matt Castaneda."]
        },
        {
            "role": "model",
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
