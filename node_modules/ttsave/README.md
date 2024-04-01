# TTSAVE
Scrape data from a TikTok video downloader and get direct info & url links from your TikTok video

## Install
```
npm install ttsave
```

## Changelog
> ### v1.0.0
- Fix Undefined Video & audio url
- Initial Commit

## Usage
```
const tiktok =  require("ttsave");

const link = "https://www.tiktok.com/@dakwahmuezza/video/7150544062221749531"

tiktok.getInfo(link)
  .then((result) => {
    console.log(result);
  })
```

## Issues & Contact
> Create issue session in [Github Repo](https://github.com/wffzy/ttsave/issues)

> You can reach me on [Telegram](https://t.me/@zrvxf2)

### Thanks for using my module, Hope you forgive me if it shows an error, because I'm newbie at this :>
