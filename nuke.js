/**
 * DISCLAIMER:
 * This bot is provided solely for educational and demonstration purposes.
 * We assume no liability for any harm, damages, or misuse resulting from its use.
 * It is strictly prohibited to use this bot for any malicious or harmful activities.
 *
 * Created by @apt_start_latifi
 * Help: https://iddox.tech/
 */
require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const readline = require('readline');
const red = "\x1b[31m";
const green = "\x1b[32m";
const rgbDarkPurple = "\x1b[38;2;128;0;128m";
const blue = "\x1b[34m";
const reset = "\x1b[0m";
const darkPurple = "\x1b[38;2;128;0;128m";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARN] The command at ${filePath} is missing "data" or "execute" property.`);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const bigAscii = `
            ███████████████████████████████████████████████████████████████████████████
            █▄─▄▄▀█▄─▄█─▄▄▄▄█─▄▄▄─█─▄▄─█▄─▄▄▀█▄─▄▄▀███▄─▀█▄─▄█▄─██─▄█▄─█─▄█▄─▄▄─█▄─▄▄▀█
            ██─██─██─██▄▄▄▄─█─███▀█─██─██─▄─▄██─██─████─█▄▀─███─██─███─▄▀███─▄█▀██─▄─▄█
            ▀▄▄▄▄▀▀▄▄▄▀▄▄▄▄▄▀▄▄▄▄▄▀▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▀▀▀▀▄▄▄▀▀▄▄▀▀▄▄▄▄▀▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀
`;
const smallAscii = `
                                    █▄▄ █▄█   █ █▀▄ █▀▄ █▀█ ▀▄▀
                                    █▄█ ░█░   █ █▄▀ █▄▀ █▄█ █░█
`;

function mainMenu() {
    console.clear();
    console.log(rgbDarkPurple  + bigAscii + reset);
    console.log(darkPurple + smallAscii + reset);
    console.log(red + "                     αℓℓ ¢σммαη∂ѕ αℓѕσ ανιαвℓє ση ∂ιѕ¢σя∂ αѕ ѕℓαѕн-¢σммαη∂" + reset);
    console.log(red + "                ρℓєαѕє υѕє тнιѕ вσт ƒσя ρяα¢тι¢є ρυяρσѕєѕ σηℓу. ∂ση'т нαям αηуσηє!" + reset);
    console.log(green + "C:/Iddox/" + reset);
    console.log(green + "├── 1. Nuke" + reset + " - Nuke the Server lol");
    console.log(green + "├── 2. Create" + reset + " - Create Channels [Name] [Number]");
    console.log(green + "├── 3. Ping" + reset + " - Send Embed @everyone Message [Title] [Text] [Number]");
    console.log(green + "├── 4. R-delete" + reset + " - Delete Roles");
    console.log(green + "├── 5. R-create" + reset + " - Create Roles");
    console.log(green + "├── 6. PB / Icon" + reset + " - Change Server-Icon");
    console.log(green + "└── 7. Clear" + reset + " - Delete all Channels");
    rl.question(blue + "Choose: " + reset, answer => {
        switch(answer.trim()){
            case "1":
                executeNuke();
                break;
            case "2":
                executeCreate();
                break;
            case "3":
                executePing();
                break;
            case "4":
                executeRDelete();
                break;
            case "5":
                executeRCreate();
                break;
            case "6":
                executePB();
                break;
            case "7":
                executeClear();
                break;
            default:
                console.log("Ungültige Option.");
                setTimeout(mainMenu, 1000);
                break;
        }
    });
}

function createFakeInteraction(options) {
    const guild = client.guilds.cache.first();
    return {
        client,
        guild,
        options: {
            getString: (key) => options[key],
            getInteger: (key) => options[key],
        },
        deferReply: async (opts) => { console.log("Defer reply:", opts); },
        editReply: async (msg) => { console.log("Edit reply:", msg); },
        reply: async (msg) => { console.log("Reply:", msg); }
    };
}

function executeNuke(){
    rl.question("Channel Name: ", channel_name => {
        rl.question("Channel Number: ", channel_number => {
            rl.question("Channel Type (text/voice/random): ", channel_type => {
                rl.question("Embed Title: ", embed_title => {
                    rl.question("Embed Message: ", embed_message => {
                        rl.question("Ping Number: ", ping_number => {
                            rl.question("Image URL (optional, Enter zum Überspringen): ", image_url => {
                                const options = {
                                    channel_name,
                                    channel_number: parseInt(channel_number),
                                    channel_type,
                                    embed_title,
                                    embed_message,
                                    ping_number: parseInt(ping_number),
                                    image_url: image_url || undefined
                                };
                                const fakeInteraction = createFakeInteraction(options);
                                const cmd = client.commands.get("nuke");
                                if(cmd){
                                    cmd.execute(fakeInteraction)
                                    .then(() => {
                                        console.log("Nuke executed.");
                                        setTimeout(mainMenu, 1500);
                                    })
                                    .catch(err => {
                                        console.error(err);
                                        setTimeout(mainMenu, 1500);
                                    });
                                } else {
                                    console.log("Nuke command not found.");
                                    setTimeout(mainMenu, 1500);
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

function executeCreate(){
    rl.question("Channel Name: ", name => {
        rl.question("Channel Number: ", number => {
            rl.question("Channel Type (text/voice/random): ", type => {
                const options = {
                    name,
                    number: parseInt(number),
                    type
                };
                const fakeInteraction = createFakeInteraction(options);
                const cmd = client.commands.get("create");
                if(cmd){
                    cmd.execute(fakeInteraction)
                    .then(() => {
                        console.log("Create executed.");
                        setTimeout(mainMenu, 1500);
                    })
                    .catch(err => {
                        console.error(err);
                        setTimeout(mainMenu, 1500);
                    });
                } else {
                    console.log("Create command not found.");
                    setTimeout(mainMenu, 1500);
                }
            });
        });
    });
}

function executePing(){
    rl.question("Embed Title: ", embed_title => {
        rl.question("Embed Message: ", embed_message => {
            rl.question("Ping Number: ", ping_number => {
                const options = {
                    embed_title,
                    embed_message,
                    ping_number: parseInt(ping_number)
                };
                const fakeInteraction = createFakeInteraction(options);
                const cmd = client.commands.get("ping");
                if(cmd){
                    cmd.execute(fakeInteraction)
                    .then(() => {
                        console.log("Ping executed.");
                        setTimeout(mainMenu, 1500);
                    })
                    .catch(err => {
                        console.error(err);
                        setTimeout(mainMenu, 1500);
                    });
                } else {
                    console.log("Ping command not found.");
                    setTimeout(mainMenu, 1500);
                }
            });
        });
    });
}

function executeRDelete(){
    const options = {};
    const fakeInteraction = createFakeInteraction(options);
    const cmd = client.commands.get("r-delete");
    if(cmd){
        cmd.execute(fakeInteraction)
        .then(() => {
            console.log("R-delete executed.");
            setTimeout(mainMenu, 1500);
        })
        .catch(err => {
            console.error(err);
            setTimeout(mainMenu, 1500);
        });
    } else {
        console.log("R-delete command not found.");
        setTimeout(mainMenu, 1500);
    }
}

function executeRCreate(){
    rl.question("Role Title: ", title => {
        rl.question("Role Number: ", number => {
            const options = {
                title,
                number: parseInt(number)
            };
            const fakeInteraction = createFakeInteraction(options);
            const cmd = client.commands.get("r-create");
            if(cmd){
                cmd.execute(fakeInteraction)
                .then(() => {
                    console.log("R-create executed.");
                    setTimeout(mainMenu, 1500);
                })
                .catch(err => {
                    console.error(err);
                    setTimeout(mainMenu, 1500);
                });
            } else {
                console.log("R-create command not found.");
                setTimeout(mainMenu, 1500);
            }
        });
    });
}

function executePB(){
    rl.question("Image URL: ", url => {
        const options = { url };
        const fakeInteraction = createFakeInteraction(options);
        const cmd = client.commands.get("pb");
        if(cmd){
            cmd.execute(fakeInteraction)
            .then(() => {
                console.log("PB executed.");
                setTimeout(mainMenu, 1500);
            })
            .catch(err => {
                console.error(err);
                setTimeout(mainMenu, 1500);
            });
        } else {
            console.log("PB command not found.");
            setTimeout(mainMenu, 1500);
        }
    });
}

function executeClear(){
    const options = {};
    const fakeInteraction = createFakeInteraction(options);
    const cmd = client.commands.get("clear");
    if(cmd){
        cmd.execute(fakeInteraction)
        .then(() => {
            console.log("Clear executed.");
            setTimeout(mainMenu, 1500);
        })
        .catch(err => {
            console.error(err);
            setTimeout(mainMenu, 1500);
        });
    } else {
        console.log("Clear command not found.");
        setTimeout(mainMenu, 1500);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`Kein Command gefunden für ${interaction.commandName}`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Bei der Ausführung dieses Befehls ist ein Fehler aufgetreten!', ephemeral: true });
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    mainMenu();
});

client.login(process.env.BOT_TOKEN);
