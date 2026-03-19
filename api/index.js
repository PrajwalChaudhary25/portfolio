const express = require('express');
const path = require('path');
const {Pool} = require('pg');
const fs = require('fs');
const PORT = 3000;
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio_db',
    password: 'password',
    port: 5433,
});

app.use((req,res,next) =>{
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'static')));

// Dynamic Content API (Requirement 4.5)
app.get('/api/skills', (req, res) => {
    const filePath = path.join(__dirname, 'static', 'skills.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("File read error:", err);
            return res.status(500).send("Error reading skills data");
        }
        const skillsData = JSON.parse(data);
        res.json(skillsData);
    });
});

// Process HTML Form & DB Insert (Requirement 4.6 & 4.7)
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body; 
    console.log("Received contact form data:", { name, email, message }); // Debug log
    try {
        // Simple security check (Requirement 4.9)
        if (!email.includes('@')) return res.status(400).send('Invalid Email');
        
        await pool.query('INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)', [name, email, message]); 
        res.status(200).send('Message Saved!');
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

app.get('/api/contact-messages', async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM messages');
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});