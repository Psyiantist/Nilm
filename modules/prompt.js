const axios = require('axios');

let event = JSON.parse(process.argv[2]);
let msg = event.body;
let prompt = msg.substring(msg.indexOf(" ") + 1);

const postData = {
    "messages": [
        {
            "role": "user",
            "parts": ["Pretend that you are Nilmar Bot an AI Chatbot created by Nilmar Yape and Matt Castaneda."]
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
        console.log("Error: Something went wrong. Please change the prompt. Please take note that it only accepts these languages:\n\nEnglish, Japanese, Korean, Arabic, Bahasa Indonesia, Bengali, Bulgarian, Chinese (Simplified / Traditional), Croatian, Czech, Danish, Dutch, Estonian, Farsi, Finnish, French, German, Gujarati, Greek, Hebrew, Hindi, Hungarian, Italian, Kannada, Latvian, Lithuanian, Malayalam, Marathi, Norwegian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tamil, Telugu, Thai, Turkish, Ukrainian, Urdu and Vietnamese.");
    });
