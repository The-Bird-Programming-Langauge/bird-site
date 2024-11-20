const express = require('express');
const cors = require('cors');
const app = express();
const { exec } = require('child_process');

app.use(cors());
app.use(express.json());



const PORT = 5174;



app.post('/compile-bird', (req, res) => {
    const code = req.body.code;

    exec(`./compiler ${code}`, (err, stdout, stderr) => {
        console.log(err);
        console.log(stdout);
        console.log(stderr);
    });

    res.send("test");
});



app.listen(PORT, () => {
    console.log(`--- Backend server is currently running on port ${PORT} ---`);
});