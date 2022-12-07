const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser=require('body-parser');
const port = 3001;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

app.post('/ai-meditation/generate-happy-place', (req, res) => {
    const body = req.body;
    console.log('body');
    console.log(body);
    if (body) {
        const prompt = body.prompt;
        if (prompt) {
            const data = JSON.stringify({
                "version": "0827b64897df7b6e8c04625167bbb275b9db0f14ab09e2454b9824141963c966",
                "input": {
                    "prompt": prompt
                },
            });  
            var requestOptions = {
                method: 'POST',
                headers: {
                    'Authorization':'Token d379175060caea010cbc4c7a7f56d9d09252e2a8',
                    'Content-Type':'application/json'
                },
                body: data,
                redirect: 'follow'
            };
            
            fetch("https://api.replicate.com/v1/predictions", requestOptions)
            .then(response => response.text())
            .then(result => {
                return res.status(201).json({
                    ok:true,
                    data: { result }
                });
            })
            .catch(error => {
                console.log('error', error);
                return res.status(400).json({
                    ok:false,
                    message: { error }
                });
            });
        }
        else {
            return res.status(400).json({
                ok:false,
                message: 'No prompt received'
            });
        }
    }
    else {
        return res.status(400).json({
            ok:false,
            message: 'No body received'
        });
    }
});

app.get('/ai-meditation/get-happy-place/:generationId', (req, res) => {
    const generationId = req.params.generationId;
    if (generationId) {
        var requestOptions = {
            method: 'GET',
            headers: {
                'Authorization':'Token d379175060caea010cbc4c7a7f56d9d09252e2a8',
                'Content-Type':'application/json'
            }
        };
        
        fetch(`https://api.replicate.com/v1/predictions/${generationId}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            return res.status(201).json({
                ok:true,
                data: { result }
            });
        })
        .catch(error => {
            console.log('error', error);
            return res.status(400).json({
                ok:false,
                message: { error }
            });
        });
    }
    else {
        return res.status(400).json({
            ok:false,
            message: 'No generationId received'
        });
    }
});