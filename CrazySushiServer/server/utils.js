fs = require('fs');


function generateId() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    let result = nums.charAt(Math.floor(Math.random() * nums.length));
    result += nums.charAt(Math.floor(Math.random() * nums.length));
    result += nums.charAt(Math.floor(Math.random() * nums.length));
    result += nums.charAt(Math.floor(Math.random() * nums.length));
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    return result;
}


function generateMenu() {
    const NUM_PIATTI = 155;
    let piatti = new Map();
    
    for (let i = 1; i <= NUM_PIATTI; i++) {
      piatti.set(i.toString(), new Map());
    }
    piatti.set("2A", new Map());
    piatti.set("12A", new Map());
    piatti.set("20A", new Map());
    piatti.set("48A", new Map());
    piatti.set("60A", new Map());
    piatti.set("61A", new Map());
    piatti.set("70A", new Map());
    piatti.set("89A", new Map());
    piatti.set("107A", new Map());
    piatti.set("107B", new Map());
    piatti.set("116A", new Map());
    piatti.set("125A", new Map());
    piatti.set("134A", new Map());
    piatti.set("134B", new Map());
    piatti.set("143A", new Map());
    piatti.set("149A", new Map());

    /*
    let piattiObj = {};
    for (let [key, value] of piatti) {
        piattiObj[key] = value;
      }
    let jsonString = JSON.stringify(piattiObj);
    // Scrivi la stringa JSON in un file
    
    fs.writeFile('./menu.json', jsonString, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('File salvato correttamente');
        }
    });

    */
   /*
    try {
        const data = fs.readFileSync('./menu.json', 'utf8');
        piatti = JSON.parse(data);
        console.log(piatti);
    } catch (err) {
        console.error(err);
    }
    */
    return piatti;
}


function getMenu() {
    // return generateMenu().keys();
    let result = []
    for (let key of generateMenu().keys()) {
        result.push(key);
    }
    return result;
}
  


module.exports = {generateId, generateMenu, getMenu}


