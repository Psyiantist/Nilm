const description = 'Make the bot speak.';
const usage = '(tl/en/ru/ko/ja) (text)';
const type = '1';
const fs = require('fs');
const request = require('request');

const event = JSON.parse(process.argv[2]);
const msg = event.body;

let link = "n";
let data = msg.split(" ");
let param0 = msg.substring(msg.indexOf(" ") + 1);

if (data.length > 1) {
  let lang = param0.split(" ")[0];
  let param = param0.substring(param0.indexOf(" ") + 1);

  switch (lang.toLowerCase()) {
    case "en":
      link = `https://translate.google.com/translate_tts?ie=UTF-8&q=${param}&tl=en&client=tw-ob`;
      break;
    case "tl":
      link = `https://translate.google.com/translate_tts?ie=UTF-8&q=${param}&sl=en&tl=tl&client=tw-ob`;
      break;
    case "ru":
      link = `https://translate.google.com/translate_tts?ie=UTF-8&q=${param}&sl=tl&tl=ru&client=tw-ob`;
      break;
    case "ko":
      link = `https://translate.google.com/translate_tts?ie=UTF-8&q=${param}&sl=tl&tl=ko&client=tw-ob`;
      break;
    case "ja":
      link = `https://translate.google.com/translate_tts?ie=UTF-8&q=${param}&sl=tl&tl=ja&client=tw-ob`;
      break;
    default:
      link = "n";
  }

  if (link !== "n") {
    const callback = () => {
      console.log(JSON.stringify({
          "attachment": `./cache/${event.senderID}.mp3`
        }));
    };
    request(encodeURI(link))
      .pipe(fs.createWriteStream(`./cache/${event.senderID}.mp3`))
      .on("close", () => callback());
  } else {
    console.log("Syntax Error: these are the allow languages:\n\ntl - Tagalog\nen - English\nru - Russian\nko - Korean\nja - Japanese\n\n You can use it like this:\n/say tl mahal kita");
  }
}
