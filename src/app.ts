require('dotenv').config();
import * as express from "express";
import * as bodyParser from "body-parser";
import * as request from "request";
import { Game, FreddyGame, GameBtnPayload } from "./game";
import * as _ from "lodash";

// Azure endpoint: https://ustw-messenger-bot.azurewebsites.net
// ref link: https://m.me/745690295614944?ref=azazer

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const app = express().use(bodyParser.json());

console.log(`PAGE_ACCESS_TOKEN=${PAGE_ACCESS_TOKEN}`);
console.log(`VERIFY_TOKEN=${VERIFY_TOKEN}`);

const games: {[key: string]: Game} = {
  [FreddyGame.RefId]: new FreddyGame(callSendAPI)
};

// Sets server port and logs message on success
app.listen(process.env.PORT || 3978, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        // const text = webhook_event.message.text;
        // const game = _.find(_.values(games), (g: Game) => g.triggerGameByMessage(sender_psid, text));
        // if (!game) {
        //   const text = "哈囉！您好！想開始玩小遊戲的話請輸入本站『TRA40週年特別企劃』專訪人物的名字喔，例如『林昶佐』、『freddy』等";
        //   callSendAPI(sender_psid, {text});
        // }
      } else if (webhook_event.postback) {
        const payload: GameBtnPayload = JSON.parse(webhook_event.postback.payload);
        const refId = payload.refId;
        const game = games[refId];
        if (game) {
          game.handlePostback(sender_psid, payload);
        }
      } else if (webhook_event.referral) {
        const refId = webhook_event.referral.ref;
        const game = games[refId];
        if (game) {
          game.handleReferral(sender_psid);  
        }
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, received_message) {
  let response;
  
  // Checks if the message contains text
  if (received_message.text) {    
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an attachment!`
    }
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  } 
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}
