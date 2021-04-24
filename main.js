import { Client }       from 'Discord.js';
import { readFileSync } from 'fs';

const loadJSON = (f) => { 
    try {
        return JSON.parse(readFileSync(f).toString());
    } catch (err) {
        console.log(err);
        return [];
    }
};

const auth    = loadJSON('auth.json');
const config  = loadJSON('config.json');

const client   = new Client();
const commands = new Map();

commands.set("clear", (msg, argv) => {
    msg.channel.messages.fetch().then(msgs => msg.channel.bulkDelete(msgs.size));
});

client.on("ready", () => { console.log("Ready!"); });
client.on("message", async (msg) => {
    if (! msg.content.startsWith(config.botPrefix)) {
        return;
    }

    // tokenise
    const argv = msg.content.substr(config.botPrefix.length).trim().split(/\s+/g);

    // parse message
    console.log(argv);

    if (argv.length > 0 && commands.has(argv[0])) {
        commands.get(argv[0])(msg, argv.slice(1, argv.length));
    }
});

client.login(auth.loginToken) .catch(console.error);

