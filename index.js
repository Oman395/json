const fs = require("fs");
const readline = require('readline');
var data;
if (!fs.existsSync("./data.json")) {
    fs.writeFileSync("./data.json", JSON.stringify({}));
}
var usrData = JSON.parse(fs.readFileSync("./data.json"));
if (!fs.existsSync("./files")) {
    fs.mkdir("./files", () => { });
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
        rl.question('Would you like to resume previous, or start a different file (if the path you specify does not exist, a new file will be created)? R/S ', (answer) => {
            var args = answer.split(" ");
            args[0] = args[0].toUpperCase();
            args[0] = args[0][0];
            switch (args[0]) {
                case "R":
                    if (usrData.resumePath) {
                        data = JSON.parse(fs.readFileSync(`${usrData.resumePath}.json`));
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
                            data = JSON.parse(fs.readFileSync(`./files/${args[1]}.json`));
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
                default:
                    console.log("Sorry, I didn't understand that. Please try again with 'R' or 'S'.");
                    rl.close();
                    loop();
            }
        });
    } else {
        var q = "What would you like to do? If you don't know what to do, type 'H'!";
        if(!usrData.actPath) usrData.actPath = [];
        if (usrData.actPath.length > 0) {
            q += " "
        }
        usrData.actPath.forEach((item) => {
            if (usrData.actPath.length - 1 > usrData.actPath.indexOf(item)) {
                q += `${item}.`;
            } else {
                q += `${item}`;
            }
        });
        q += " > ";
        rl.question(q, (answer) => {
            var args = answer.split(" ");
            args[0] = args[0].toUpperCase();
            args[0] = args[0][0];
            switch (args[0]) {
                case "H":
                    if (!args[1]) {
                        help(1);
                        rl.close();
                        loop();
                    } else {
                        args[1] = args[1].toUpperCase();
                        help(2, args[1]);
                        rl.close();
                        if (args[1] != "E") {
                            loop();
                        } else {
                            fs.writeFileSync("./data.json", JSON.stringify(usrData));
                        }
                    }
                    break;
                case "E":
                    console.log("Goodbye!");
                    fs.writeFileSync("./data.json", JSON.stringify(usrData));
                    fs.writeFileSync(`${usrData.resumePath}.json`, JSON.stringify(data));
                    rl.close();
                    break;
                default:
                    console.log(`Sorry, I didn't understand ${args[0]}. Press h if you don't know what to do.`);
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
                        fs.writeFileSync("./data.json", JSON.stringify(usrData));
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
                    var q = "";
                    usrData.actPath.forEach((item) => {
                        q += `.${item}`;
                    });
                    console.log(map);
                    console.log(`Current path is ${usrData.name}${q}`)
                    rl.close();
                    loop();
                    break;
                case "G":
                    if (args[1]) {
                        try {
                            usrData.actPath.push(args[1]);
                        } catch {
                            console.log("Please specify a valid path.");
                        }
                    } else {
                        console.log("Please specify a path.");
                    }
                    rl.close();
                    loop();
                    break;
                case "B":
                    usrData.actPath.pop();
                    rl.close();
                    loop();
                    break;
                case "A":
                    var currentData = data;
                    usrData.actPath.forEach((pathItem) => {
                        if (pathItem) {
                            currentData = currentData[pathItem];
                        }
                    });
                    if (args[1]) {
                        currentData[args[1]] = {};
                        fs.writeFileSync(`${usrData.resumePath}.json`, JSON.stringify(data));
                    } else {
                        console.log("Please specify a name.");
                    }
                    rl.close();
                    loop();
                    break;
                case "S":
                    if (args[1] && args[2]) {
                        var currentData = data;
                        try {
                            usrData.actPath.forEach((pathItem) => {
                                currentData = currentData[pathItem];
                            });
                        } catch {
                            usrData.actPath = [];
                            currentData = data;
                        }
                        if (!currentData[args[1]]) {
                            currentData[args[1]] = "";
                        }
                        if (currentData[args[1]].length || Object.keys(currentData[args[1]]).length == 0) {
                            currentData[args[1]] = args[2];
                            for (let i = 3; i < args.length; i++) {
                                currentData[args[1]] += ` ${args[i]}`;
                            }
                        } else {
                            console.log("Please only write to an index without sub indexes.");
                        }
                    } else if (args[1]) {
                        console.log("Please add a name.");
                    } else if (args[2]) {
                        console.log("Please add data.");
                    } else {
                        console.log("Please add the index, and data.");
                    }
                    rl.close();
                    loop();
                    break;
                case "D":
                    if (args[1]) {
                        var currentData = data;
                        try {
                            usrData.actPath.forEach((pathItem) => {
                                currentData = currentData[pathItem];
                            });
                        } catch {
                            usrData.actPath = [];
                            currentData = data;
                        }
                        if (currentData && currentData[args[1]]) {
                            if (currentData[args[1]].length || Object.keys(currentData[args[1]]).length == 0) {
                                delete currentData[args[1]];
                            } else {
                                console.log("Sorry, please don't delete items with sub items.");
                            }
                        } else {
                            console.log("Sorry, that index does not exist.");
                        }
                    } else {
                        console.log("Please add an index.");
                    }
                    rl.close();
                    loop();
                    break;
            }
        });
        fs.writeFileSync(`${usrData.resumePath}.json`, JSON.stringify(data));
    }
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
        A: {
            1: "Add index",
            2: "It's not hard man, just name the index -.-"
        },
        S: {
            1: "Set value of an index, as long as it doesen't have anything after it (indexes can either be folders or data, it's pretty loose).",
            2: "I put literally all the info on the first one, why are you here?",
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