const fs = require("fs");
const readline = require('readline');
var data;
if (!fs.existsSync("./data.json")) {
    fs.writeFileSync("./data.json", JSON.stringify({}));
}
var usrData = JSON.parse(fs.readFileSync("./data.json"));
if (!fs.existsSync("./files")) {
    fs.mkdir("./files", () => {});
}
if (!usrData.actPath) {
    usrData.actPath = "";
}

function loop() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    if (!data) {
        rl.question('Would you like to resume previous, or start a different file (if the path you specify does not exist, a new file will be created)? R/S', (answer) => {
            var args = answer.split(" ");
            args[0] = args[0].toUpperCase();
            switch (args[0]) {
                case "R":
                    if (usrData.resumePath) {
                        data = JSON.parse(fs.readFileSync(usrData.resumePath));
                        rl.close();
                        loop();
                    } else {
                        data = fs.readFileSync("./files/data.json");
                        usrData.resumePath = "./files/data.json";
                        usrData.name = "data";
                        rl.close();
                        loop();
                    }
                    break;
                case "S":
                    if (args[1]) {
                        if (fs.existsSync(`./files/${args[1]}.json`)) {
                            data = JSON.parse(fs.readFileSync(`./files/${args[1]}`));
                        } else {
                            data = {};
                            fs.writeFileSync(`./files/${args[1]}.json`, JSON.stringify(data));
                        }
                        usrData.name = args[1];
                        usrData.actPath = "";
                        usrData.resumePath = `./files/${args[1]}`;
                        rl.close();
                        loop();
                    } else {
                        console.log("ERR: Please specify a file");
                        rl.close();
                        loop();
                    }
                    break;
            }
        });
    }
    rl.question("What would you like to do? If you don't know what to do, type 'H'!", (answer) => {
        var args = answer.split(" ");
        args[0] = args[0].toUpperCase();
        switch (args[0]) {
            case "H":
                if (!args[1]) {
                    help(1);
                    rl.close();
                    loop();
                } else {
                    help(2, args[1]);
                    rl.close();
                    if (!args[1] == "E") {
                        loop();
                    } else {
                        fs.writeFileSync("./data.json", JSON.stringify(usrData));
                    }
                }
                break;
            case "E":
                console.log("Goodbye!");
                fs.writeFileSync("./data.json", JSON.stringify(usrData));
                rl.close();
                break;
            default:
                console.log(`Sorry, I didn't understand ${answer}. If you need help, just type 'H' when prompted for any input!`);
                rl.close();
                loop();
                break;
            case "N":
                if (args[1]) {
                    if (fs.existsSync(`./files/${args[1]}.json`)) {
                        data = JSON.parse(fs.readFileSync(`./files/${args[1]}.json`));
                    } else {
                        data = {};
                        fs.writeFileSync(`./files/${args[1]}.json`, JSON.stringify(data));
                    }
                    usrData.resumePath = `./files/${args[1]}.json`;
                    usrData.name = args[1];
                    rl.close();
                    loop();
                } else {
                    console.log("ERR: Please specify a file");
                    rl.close();
                    loop();
                }
                break;
            case "M":
                var string = JSON.stringify(data);
                var y = 0;
                var map = `${usrData.name}`;
                var pushAmnt = 0;
                for (let i = 0; i < string.length; i++) {
                    switch (string[i]) {
                        case "{":
                            map += "\n";
                            pushAmnt++;
                            for (let i = 0; i < pushAmnt; i++) {
                                map += " ";
                            }
                            break;
                        case "}":
                            pushAmnt--;
                            break;
                        case ",":
                            map += "\n";
                            for (let i = 0; i < pushAmnt; i++) {
                                map += " ";
                            }
                            break;
                        case '"':
                            break;
                        default:
                            map += string[i];
                    }
                }
                console.log(map);
                rl.close();
                loop();
                break;
        }
    });
}
loop();

function help(menu, item) {
    var options = {
        H: {
            1: "Helps you out.",
            2: "Why are you asking help for help with help?",
        },
        N: {
            1: "New file, or open previous",
            2: "Input the name of the file to either create or open.",
        },
        M: {
            1: "Map, shows where you are within the JSON file.",
            2: "Just say 'M', it's not hard.",
        },
        G: {
            1: "Go to location, sends you to that location.",
            2: "Input the path using this syntax: **.**.** etc etc. Fairly simple, just don't misstype.",
        },
        B: {
            1: "Go back a level in JSON",
            2: "It's self explanatory.",
        },
        E: {
            1: "Exits.",
            2: "Exits. Like thi-",
        },
    }
    if (menu == 1) {
        for (var option in options) {
            console.log(`${option}: ${options[option]['1']}\n`);
        }
    } else {
        if (options[item]) {
            console.log(`${item}, more detail: ${options[item]['2']}\n`);
        } else {
            console.log(`Sorry, ${item} does not exist.`);
        }
    }
}