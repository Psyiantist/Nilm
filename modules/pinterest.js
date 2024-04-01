const fs = require("fs");
const login = require("fca-unofficial");
const {
	spawn
} = require('child_process');
const express = require('express');

const app = express();

const server = app.listen(3000, () => {});
app.get('/', (req, res) => {
	res.send('Bot is up and running.');
});

var admins = [];
var vips = [];
var vipCmds = [];
const prefix = '/';
var status = true;
var onProcess = 0;
var threaderProcess = false;

function readFile(file) {
	try {
		const data = fs.readFileSync(file, 'utf8');
		return data.trim().split('\n');
	} catch (err) {
		console.error(err);
		return null;
	}
}

function toggle(filename, searchString) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}

			const lines = data.split('\n');
			const index = lines.findIndex(line => line.trim() === searchString);

			if (index !== -1) {
				lines.splice(index, 1);
				const updatedData = lines.join('\n');
				fs.writeFile(filename, updatedData, 'utf8', err => {
					if (err) {
						console.error(err);
						reject(err);
						return;
					}
					console.log(`String '${searchString}' removed from ${filename}.`);
					resolve(false);
				});
			} else {
				lines.push(searchString);
				const updatedData = lines.join('\n');
				fs.writeFile(filename, updatedData, 'utf8', err => {
					if (err) {
						console.error(err);
						reject(err);
						return;
					}
					console.log(`String '${searchString}' added to ${filename}.`);
					resolve(true);
				});
			}
		});
	});
}

function waitProcess() {
	return new Promise(resolve => {
		const interval = setInterval(() => {
			if (onProcess < 2) {
				clearInterval(interval);
				resolve();
			}
		}, 100);
	});
}

function waitThreaderProcess() {
	return new Promise(resolve => {
		const interval = setInterval(() => {
			if (threaderProcess == false) {
				clearInterval(interval);
				resolve();
			}
		}, 100);
	});
}

admins = readFile('./permissions/admins.txt');
vips = readFile('./permissions/vips.txt');
vipCmds = readFile('./permissions/vipCmds.txt');

login({
	appState: JSON.parse(fs.readFileSync('customizable/appstate.json', 'utf8'))
}, async (err, api) => {
	if (err) return console.error(err);

	api.setOptions({
		listenEvents: true,
		selfListen: true,
		autoMarkDelivery: false,
		online: true
	});

	const myID = await api.getCurrentUserID();

	fs.readFile('logs/lastmg.txt', 'utf8', (err, msgid) => {
		if (err) {
			return;
			console.error(err)
		}
		if (msgid != '') {
			api.setMessageReaction('🟢', msgid, (err) => {
				if (err) {
					return;
				}
			}, true)
		}
	});

	async function run(filePath, event) {
		if (fs.existsSync(filePath)) {
			await waitProcess();
			onProcess += 1;

			const childProcess = spawn('node', [filePath, JSON.stringify(event)], {
				stdio: ['inherit', 'pipe', 'pipe']
			});

			childProcess.stdout.on('data', (data) => {
				var output = data.toString().trim();

				try {
					output = JSON.parse(output);

					if (fs.statSync(output.attachment).isDirectory()) {
						const files = fs.readdirSync(output.attachment);

						const attachmentStreams = files.map(file => {
							const filePath = `${output.attachment}/${file}`;
							return fs.createReadStream(filePath);
						});

						api.sendMessage({
							body: output.body,
							attachment: attachmentStreams,
						}, event.threadID, event.messageID);

							fs.rmdirSync(output.attachment, {recursive: true});
					} else {
						api.sendMessage({
								body: output.body,
								attachment: fs.createReadStream(output.attachment),
							}, event.threadID, (err) => {
                if (err) {
                  api.sendMessage('Please change the prompt or try again.', event.threadID, event.messageID);
                } else fs.unlinkSync(output.attachment);
              }, event.messageID)
					}
				} catch (e) {
					api.sendMessage(output, event.threadID, event.messageID);
				}
			})


			childProcess.stderr.on('data', (data) => {
				const error = data.toString().trim();
				console.log(error);
				api.sendMessage("Something went wrong. Please try again later.", event.threadID, event.messageID);
			});

			childProcess.on('close', (code) => {
				onProcess -= 1;
			});
		}
	}

	async function threader(threadID) {
		await waitThreaderProcess()
		threaderProcess = true;
		const threadInfo = await api.getThreadInfo(threadID);

		setTimeout(() => {
			threaderProcess = false;
		}, 30000)

		return threadInfo;
	}


	var listenEmitter = api.listen(async (err, event) => {
		if (err) return console.error(err);

		if (event.type == 'event') {
			switch (event.logMessageType) {
				case 'log:unsubscribe':
					const threads = readFile('permissions/antiout.txt');

					if (threads.includes(event.threadID)) {
						api.addUserToGroup(event.author, event.threadID);
					}
					break;
			}
		}

		if (event.body) {

			let command = event.body.split(" ")[0];
			command = command.substring(1);

			if (event.type == 'message' || 'message_reply') {

				//ADMIN COMMANDS
				if (admins.includes(event.senderID)) {
					if (!status && event.body.startsWith(prefix + 'on')) {
						status = true;
						api.setMessageReaction('🟢', event.messageID, (err) => {
							if (err) {
								return;
							}
						}, true);
						return;
					} else if (status && event.body.startsWith(prefix + 'off')) {
						status = false;
						api.setMessageReaction('🔴', event.messageID, (err) => {
							if (err) {
								return;
							}
						}, true);
						return;
					} else if (status && event.body.startsWith(prefix + 'restart')) {
						fs.writeFile('logs/lastmg.txt', event.messageID, (err) => {
							if (err) {
								console.error('Error writing to file:', err);
								return;
							} else {
								api.setMessageReaction('🔄', event.messageID, (err) => {
									if (err) {
										return;
									} else {
										const pid = process.pid;
										process.kill(pid);
									}
								}, true);
							}
						});
					} else if (status && event.body.startsWith(prefix + 'admin')) {
						if (event.mentions) {
							const id = Object.keys(event.mentions)[0];
							const name = Object.values(event.mentions)[0];

							toggle('permissions/admins.txt', id)
								.then(result => {
									if (result == true) {
										api.sendMessage(`${name} is now an admin.`, event.threadID, event.messageID);
										admins.push(id.toString());
									} else {
										api.sendMessage(`${name} has been removed as an admin.`, event.threadID, event.messageID);
										admins = admins.filter(element => element !== id.toString());
									}
								})
								.catch(error => console.error(error));
						}
					} else if (status && event.body.startsWith(prefix + 'vip')) {
						if (event.mentions) {
							const id = Object.keys(event.mentions)[0];
							const name = Object.values(event.mentions)[0];

							toggle('permissions/vips.txt', id)
								.then(result => {
									if (result == true) {
										api.sendMessage(`${name} is now a VIP.`, event.threadID, event.messageID);
										vips.push(id.toString());
									} else {
										api.sendMessage(`${name} has been removed as a VIP.`, event.threadID, event.messageID);
										vips = vips.filter(element => element !== id.toString());
									}
								})
								.catch(error => console.error(error));
						}
					} else if (event.messageReply && status && event.body.startsWith(prefix + 'unsend')) {
						api.unsendMessage(event.messageReply.messageID, (err) => {
							if (err) {
								api.sendMessage('Error: Unable to unsend message. Check the console for debugging.', event.threadID, event.messageID);
								console.error(err);
							}
						});
					}
				}
				//END OFF ADMIN COMMANDS

				if (!status) return;

				if (event.messageReply && event.messageReply.body) {
					const origin = event.messageReply.body.split(" ")[0].toLowerCase();
					if (!status) return;
					run(`./events/${origin}.js`, event);
				}

				if (event.body.startsWith(prefix)) {
					
				//GC ADMINS COMMAND
					switch (command) {
						case 'autowelcome':
						case 'antiunsend':
						case 'antiout':
							const threadInfo = await threader(event.threadID);
							const adminIDs = threadInfo.adminIDs.map(item => item.id);
							const senderID = event.senderID;
							const isAdmin = adminIDs.includes(senderID);
								
							if (isAdmin) {
								toggle(`./permissions/${command}.txt`, event.threadID).then(result => {
									const action = result ? 'on' : 'off';
									api.sendMessage(`${command.toUpperCase()} is now ${action} for your GC.`, event.threadID, event.messageID);
								  });
								} else {
								  api.sendMessage(`This command is only allowed for this Groupchat's admins.`, event.threadID, event.messageID);
								}
								break;
					}

					run(`./modules/${command}.js`, event);
				}

			}
		}

	});
});