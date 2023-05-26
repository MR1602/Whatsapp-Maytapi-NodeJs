const express = require('express');
const rp = require('request-promise-native');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const INSTANCE_URL = 'https://api.maytapi.com/api';
const PRODUCT_ID = 'ae79a6fe-4e23-43f8-a187-f02050bce820';
const PHONE_ID = '29237';
const API_TOKEN = '6c67ac20-126a-4b50-94f3-7c680335a17d';
let lastmessage = {};

if (!PRODUCT_ID || !PHONE_ID || !API_TOKEN) throw Error('You need to change PRODUCT_ID, PHONE_ID and API_KEY values in app.js file.');

async function send_message(body) {
    console.log(`Request Body:${JSON.stringify(body)}`);
    let url = `${INSTANCE_URL}/${PRODUCT_ID}/${PHONE_ID}/sendMessage`;
    let response = await rp(url, {
        method: 'post',
        json: true,
        body,
        headers: {
            'Content-Type': 'application/json',
            'x-maytapi-key': API_TOKEN,
        },
    });
    // console.log(`Response: ${JSON.stringify(response)}`);
    return response;
}

app.post('/sendMessage', async (req, res) => {

	console.log(lastmessage, 'lastmessage')
    let { user, message } = req.body;
    let grettings = ["hello","hey","hi"]
    if(grettings.includes(message?.text.toLowerCase())){
		lastmessage[user?.phone] = message?.text.toLowerCase()
        let response = await send_message({ type: 'text', message: "hi, welcome to TechOn. How may we help you today? 1. Customer support 2. Sales", to_number: user?.phone });
        res.send({ response });
        
    }else if(grettings.includes(lastmessage[user?.phone])){
		let response;
        if(message?.text == "1"){   
            response = await send_message({ type: 'text', message: "we'll connect you to support shortly.", to_number: user?.phone });
        
		}else if(message?.text == "2"){
            response = await send_message({ type: 'text', message: "sales will reach out to you.", to_number: user?.phone });
        
		}
		lastmessage[user?.phone] = "is there anything else I can do for you?"
		let response2 = await send_message({ type: 'text', message: "is there anything else I can do for you? 1. Yes 2. NO", to_number: user?.phone });
		res.send({ response, response2 });

    }else if(lastmessage[user?.phone] == 'is there anything else I can do for you?'){

	}else{
		res.send({ response: "No Message Sent." });
	}
});

app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`);
    // await setup_network();
});