import express from 'express';

const app = express();
const PORT = 5001;

// Custom CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Expose-Headers', 'Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

// Body parser middleware
app.use(express.json());

// Auth routes
app.post('/api/auth/register', (req, res) => {
    console.log('Register endpoint hit');
    res.json({ user: { id: '1', username: req.body.username }, token: 'sample-token' });
});

app.post('/api/auth/login', (req, res) => {
    console.log('Login endpoint hit');
    res.json({ user: { id: '1', username: req.body.username }, token: 'sample-token' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
