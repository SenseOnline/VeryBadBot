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

const config  = loadJSON('config.json');

const client   = new Client();
const commands = new Map();
const channels = new Set();

commands.set("clear", async (msg, argv) => {
    msg.channel.messages.fetch().then(msgs => msg.channel.bulkDelete(msgs.size));
});
commands.set("echo", async (msg, argv) => {
    msg.channel.send(argv.join(" "));
});
commands.set("channel", async (msg, argv) => {
    let channelID = msg.channel.id;
    if(argv.length > 1)
    {
        let channelID_tmp = argv[1].match(/<#(\d+)>/)[1];
        console.log(channelID_tmp);
        if (client.channels.cache.find(chnl => chnl.id === channelID_tmp)) {
            channelID = channelID_tmp;
        }
        else
        {
            msg.channel.send("Cound not find channel!");
            return;
        }
    }

    if ("bind" === argv[0])
    {
        console.log(`Bound to channel ${channelID}`);
        channels.add(channelID)
    }
    else if ("unbind" === argv[0])
    {
        console.log(`Unbound to channel ${channelID}`);
        channels.delete(channelID);
    }
});

client.on("ready", () => { console.log("Ready!"); });
client.on("message", async (msg) => {
    if (! msg.content.startsWith(config.botPrefix)) {
        return;
    }

    if (channels.size > 0 && !channels.has(msg.channel.id)) {
        console.log("not bound channel");
        return;
    }

    // tokenise
    const argv = msg.content.substr(config.botPrefix.length).trim().split(/\s+/g);

    // send message to command
    if (argv.length > 0 && commands.has(argv[0])) {
        commands.get(argv[0])(msg, argv.slice(1, argv.length));
    }
});

client.login(loadJSON('auth.json').loginToken) .catch(console.error);

