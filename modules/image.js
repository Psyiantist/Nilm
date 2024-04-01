const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const description = 'This command will generate an image based on your prompt.';
const usage = '(prompt)';
const type = '4';

let event = JSON.parse(process.argv[2]),
    msg = event.body,
    prompt = msg.substring(msg.indexOf(" ") + 1);

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Yntec/DeliShaper",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

query({"inputs": prompt}).then(async (response) => {
    // Convert the response to a buffer
    const buffer = await response.arrayBuffer();

    // Define the path where you want to save the image
    const imagePath = path.join('cache', `${event.senderID}image.jpg`);

    // Write the buffer to the image file
    fs.writeFileSync(imagePath, Buffer.from(buffer));

    // Log the image path
    console.log(JSON.stringify({
        "attachment": imagePath
    }));
}).catch((error) => {
    console.error("Error:", error);
});
