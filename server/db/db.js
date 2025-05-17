const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

// Initialize DB file if doesn't exist
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
        tasks: [],
        users: []
    }, null, 2));
}

const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (err) {
        console.error('DB read error:', err);
        return { tasks: [], users: [] };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('DB write error:', err);
        return false;
    }
};

// CRUD Operations for Tasks
const db = {
    // Tasks
    getAllTasks: () => readDB().tasks,

    getTask: (id) => readDB().tasks.find(task => task.id === id),

    createTask: (task) => {
        const dbData = readDB();
        const newTask = {
            id: Date.now().toString(),
            ...task,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        dbData.tasks.push(newTask);
        writeDB(dbData);
        return newTask;
    },

    updateTask: (id, updates) => {
        const dbData = readDB();
        const taskIndex = dbData.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return null;

        const updatedTask = {
            ...dbData.tasks[taskIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        dbData.tasks[taskIndex] = updatedTask;
        writeDB(dbData);
        return updatedTask;
    },

    deleteTask: (id) => {
        const dbData = readDB();
        const taskIndex = dbData.tasks.findIndex(t => t.id === id);
        if (taskIndex === -1) return false;

        dbData.tasks.splice(taskIndex, 1);
        return writeDB(dbData);
    },

    // Users
    findUser: (username) => readDB().users.find(user => user.username === username),

    createUser: (user) => {
        const dbData = readDB();
        const newUser = {
            id: Date.now().toString(),
            ...user,
            createdAt: new Date().toISOString()
        };
        dbData.users.push(newUser);
        writeDB(dbData);
        return newUser;
    }
};

module.exports = db;