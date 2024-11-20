const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5174;

app.post('/compile-bird', (req, res) => {
    const code = req.body.code;

    fs.writeFileSync('temp.bird', code, (err) => {
        if (err) {
            console.log(err);
            res.send("Error in writing to file");
        }
    });

    exec('./compiler temp.bird', (err, stdout, stderr) => {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
    });

    const buffer = fs.readFileSync('output.wasm');

    res.type('application/octet-stream'); 
    res.send(buffer);
});

app.listen(PORT, () => {
    console.log(`--- Backend server is currently running on port ${PORT} ---`);
});
