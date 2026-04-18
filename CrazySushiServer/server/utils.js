const fs = require('fs');
const path = require('path');

const MENU_FILE_PATH = path.resolve(__dirname, '../../menu');


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


function parseMenuLine(line) {
    const trimmed = line.trim();
    if (!trimmed) {
        return null;
    }

    const codeMatch = trimmed.match(/^([0-9]+[A-Z]?)\.\s*(.+)$/);
    if (!codeMatch) {
        return null;
    }

    const code = codeMatch[1];
    const rawNameAndPrice = codeMatch[2];
    const name = rawNameAndPrice.split('€')[0].trim();

    if (!name) {
        return null;
    }

    return { code: code, name: name };
}


function getMenuEntries() {
    let content = '';

    try {
        content = fs.readFileSync(MENU_FILE_PATH, 'utf8');
    } catch (err) {
        console.error('Could not read menu file:', err);
        return [];
    }

    const result = [];
    const lines = content.split(/\r?\n/);

    lines.forEach((line) => {
        const parsed = parseMenuLine(line);
        if (parsed) {
            result.push(parsed);
        }
    });

    return result;
}


function getMenuNameMap() {
    const map = new Map();
    const entries = getMenuEntries();

    entries.forEach((entry) => {
        map.set(entry.code, entry.name);
    });

    return map;
}


function generateMenu() {
    let piatti = new Map();
    const entries = getMenuEntries();

    entries.forEach((entry) => {
        piatti.set(entry.code, new Map());
    });

    return piatti;
}


function getMenu() {
    return getMenuEntries();
}
  

module.exports = {generateId, generateMenu, getMenu, getMenuNameMap}


