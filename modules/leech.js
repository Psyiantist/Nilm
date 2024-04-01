 

(async () => {
    const event = JSON.parse(process.argv[2]);
    const msg = event.body;
    const link = msg.substring(msg.indexOf(" ") + 1);
    
    try {
        const info = await ytdl.getInfo(link);
        
        if (info.videoDetails.lengthSeconds > 1200) {
            console.log(`Error: Media's length is too long.`);
            process.exit(0);
        }

        
        console.log('Requesting...');
        const url = `https://www.youtube.com/watch?v=${info.videoDetails.videoId}`;
        
        const stream = ytdl(url, {
            quality: "lowest"
        });
        
        const outputFilePath = path.join('./cache', `${event.senderID}.mp3`);
        
        ffmpeg()
            .input(stream)
            .audioBitrate(192)
            .on('end', () => {
                console.log(JSON.stringify({
					"body": info.videoDetails.title,
					"attachment": outputFilePath
				  }));
            })
            .save(outputFilePath);
    } catch (e) {
        console.log(`Error: Invalid link. Make sure it's a Youtube video link.`);
        process.exit(0);
    }
})();