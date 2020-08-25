const express = require('express')
const { spawn } = require('child_process');
const app = express()
const port = 3000
app.get('/', (req, res) => {

    const python = spawn('python', ['./Tweets/script1.py']);
    const python1 = spawn('python', ['./Tweets/script2.py']);

    python.stdout.on('data', function(data) {
        console.log('Pipe data from python script ...');
        res.send("CHECK")
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    });

})
app.listen(port, () => console.log(`Example app listening on port 
${port}!`))