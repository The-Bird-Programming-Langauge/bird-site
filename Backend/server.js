const express = require("express")
const app = express();



const PORT = 5174;



app.get('/code-output', async (req, res) => {
    const codeInput = req.query.code;
    let result = "test";

    res.json(result);
});



app.listen(PORT, () => {
    console.log(`--- Backend server is currently running on port ${PORT} ---`);
});