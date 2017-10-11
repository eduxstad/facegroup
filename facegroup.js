//facegroup.js
//Facegroup - Facebook -> GroupMe - v0.1 - by eduxstad
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
//facebook app
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deploy Successful!");
});

//GroupMe Bot request setup
var headers = {
  'User-Agent': 'Facegroup/0.1',
  'Content-Type': 'application/json'
}


// Facebook Webhook
// Used for verification
app.get("/verification", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});
app.post("/webhook", function (req, res) {

  //sender_name
  //console.log("Specific content: (entry[0].changes[0].value.message)");
  console.log("Name: ");
  var name = req.body.entry[0].changes[0].value.sender_name;
  console.log(req.body.entry[0].changes[0].value.sender_name);

  //message
  //console.log("Specific content: (entry[0].changes[0].value.message)");
  console.log("Message: ");
  var message = req.body.entry[0].changes[0].value.message;
  console.log(req.body.entry[0].changes[0].value.message);

  res.sendStatus(200);

  //send GroupMe Message
  var options = {
  url: 'https://api.groupme.com/v3/bots/post',
  method: 'POST',
  headers: headers,
  form: {'text': "New Post From: " + name + "\n" + message, "bot_id": process.env.BOT_ID}
}
  
  request(options, function (error, response, body) {
    if (!error || response.statusCode == 200) {
      console.log("Message sent!");
      console.log(body);
    } else {
      console.log("Message not sent, unsuccessful");
      console.log(body);
    }
  })
  
});
