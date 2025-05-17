const fs = require('fs');
const path = './db.json';

const readDB = () => {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
};

const writeDB = (data) => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };