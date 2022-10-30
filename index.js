import { TelegramClient } from "./node_modules/telegram/index.js";
import { StringSession } from "./node_modules/telegram/sessions/index.js";
import input from "./node_modules/input/dist/lib/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import express from "express";
import Swal from "sweetalert2";
import TelegramBot from "node-telegram-bot-api";
const token = `5286214118:AAGETl07k0-beB7RHuMREfIAkNnhY8WBvVM`;
import { MongoClient } from "mongodb";
import { mongoose } from "mongoose";
const url =
  "mongodb://bot:ddddee6125919fe090550f0d7e31b88f@dokku-mongo-bot:27017/bot";
const client = new MongoClient(url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import bodyParser from "body-parser";
var urlencodedParser = bodyParser.urlencoded({ extended: false });
import Mbot from "./bot.model.js";
import Group from "./group.model.js";
import Activate from "./activate.model.js";
import Message from "./message.model.js";
import cron from "node-cron";
import dotenv from "dotenv";
import http from "http";
import { Api } from "./node_modules/telegram/tl/index.js";
import axios from "axios";
dotenv.config();

const app = express(); //Instantiate an express app, the main work horse of this server
const port = 5000; //Save the port number where your server will be listening
const bot = new TelegramBot(token, { polling: true });
app.use(express.urlencoded({ extended: true }));

// ore

// parse application/json
app.use(express.json());
// const { Client } = require('tlg')

//Idiomatic expression in express to route and respond to a client request
app.get("/", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("index.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.get("/activated", (req, res) => {
  Activate.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

app.get("/add_account", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("add_account.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.get("/create_reply", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("create_reply.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.get("/group-id", (req, res) => {
  //get requests to the root ("/") will route here
  res.sendFile("group.html", { root: __dirname }); //server responds by sending the index.html file to the client's browser
  //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile
});

app.post("/activate", (req, res) => {
  Activate.find({})
    .then((data) => {
      if (data.length < 1) {
        const botData = new Activate({
          activated: req.body.activate,
        });
        botData
          .save()
          .then((data) => {
            res.send("Successful");
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message + "Some error occurred while creating the product.",
            });
          });
      } else {
        Activate.findByIdAndUpdate(
          data[0]._id,
          {
            activated: req.body.activate,
          },
          { new: true }
        )
          .then((data) => {
            res.send("Successful");
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

app.get("/phone", (req, res) => {
  Mbot.find({ phone: { $exists: 1 } })
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
});

app.post("/create-messages", (req, res) => {
  const messag = new Message({
    message: req.body.message,
    reply: req.body.reply,
  });
  messag.save().then((data) => {
    res.send(data);
    console.log(data);
  });
});

app.post("/group", (req, res) => {
  Group.findOne({}, function (err, info) {
    console.log("hdh", info);
    if (err) {
      res.status(400);
      res.send("An error occurred");
    } else if (!info) {
      const grp = new Group({
        id: req.body.group_id,
      });
      grp
        .save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(400);
          res.send("An error occurred");
        });
    } else {
      Group.findOneAndUpdate(
        {},
        {
          id: req.body.group_id,
        },
        { new: true }
      )
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(400);
          res.send("An error occurred");
        });
    }
  });
});

// app.get('/g', (req, res) => {
//   Mbot.find({})
//   .skip(1)
//   .limit(1)
//   .then(dataa => {
//     res.send(dataa)
//   })
// })

app.post("/", urlencodedParser, (req, res) => {
  const mmbot = new Mbot({
    caption: req.body.caption,
    image: req.body.image,
  });
  mmbot
    .save()
    .then((data) => {
      res.send("Successful");
      console.log(data);
    })
    .catch((err) => console.log(err));

  // Mbot.findOneAndUpdate({ phone: req.body.phone }, {
  //   caption: req.body.caption,
  //   image: req.body.image,
  // }, { new: true })
  //   .then(data => {
  //     res.send("Successful");
  //     console.log(data)

  //   }).catch(err => console.log(err))
});

app.post("/add", (req, res) => {
  Mbot.insertMany([{ phone: req.body.phone, session: req.body.session }])
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      // Failure
    });
});

// bot.onText(/\/echo (.+)/, (msg, match) => {

//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"

//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
//     console.log(msg)
//   });

// bot.on('message', (msg) => {
//   //   const chatId = msg.chat.id;
// console.log(msg)
// Message.findOne({message: msg.text})
// .then(data => {
//   if(data){
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, data.reply, { reply_to_message_id: msg.message_id });

//   }else{
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, "There is no doubt about the legitimacy of this project", { reply_to_message_id: 23 });

//   }
// })

// });

const apiId = 21349762;
const apiHash = "3ce08a3215564b66996778ea39d5ad6f";

(async () => {
  const stringSession = new StringSession(
    "1BAAOMTQ5LjE1NC4xNjcuOTEAUEVcSCAdCA7IsNZWAgD4dgf1PN8ciiaY6vFKhvQrKpooq7dzC1UxxzwIssG4+yVxQQ8E8b8yCihqgugHP69zkGyW7DZsSdhlw7nluQRsA3/RLNUZPMki/tXhL6G6/XYXqkSk+k96I9+0rSddL6b0l10KbJuQRoCRA4YCA6qZHW6xZlFuCQZ+uYDTGxRaPWMuRVh7jD47h7SZz7ztsrCWS816kAWFAKTWQVImr7Jwd+5dk4qCZsqdpHTeVRlfaRZshRIf7Cj5OlhhE1iw6/xda3qekNgNuI3KQDIblDwBlPw56oAI8x6Ov/lcTmr0LQ4Vhxj1zFksriT6aLKX7Z6HG+c="
  );
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  client.addEventHandler((update) => {
    if (
      update.CONSTRUCTOR_ID == 1299050149 &&
      update.SUBCLASS_OF_ID == 2331323052
    ) {
      Group.findOne({}).then((ndata) => {
        if (!ndata) {
        } else {
          Message.findOne({ message: update.message }).then((data) => {
            if (data) {
              client.sendMessage(ndata.id, {
                message: data.reply,
                replyTo: update.id,
              });
            } else {
              client.sendMessage(ndata.id, {
                message:
                  "There is no doubt about the legitimacy of this project",
                replyTo: 256,
              });
            }
          });
        }
      });
    }
  });
})();

var allMsg = [];
cron.schedule("* * * * *", () => {
  recurring();
});

async function recurring() {
  Mbot.countDocuments({}).then((data) => {
    if (allMsg.length >= data) {
      allMsg = [];
      Mbot.find({})
        .skip(0)
        .limit(1)
        .then((dataa) => {
          if (dataa.length > 0) {
            allMsg.push("sent");
            Group.findOne({}, function (err, info) {
              if (err) {
                console.log("err");
              } else if (!info) {
                console.log("err");
              } else {
                (async () => {
                  const stringSession = new StringSession(
                    "1BAAOMTQ5LjE1NC4xNjcuOTEAUEVcSCAdCA7IsNZWAgD4dgf1PN8ciiaY6vFKhvQrKpooq7dzC1UxxzwIssG4+yVxQQ8E8b8yCihqgugHP69zkGyW7DZsSdhlw7nluQRsA3/RLNUZPMki/tXhL6G6/XYXqkSk+k96I9+0rSddL6b0l10KbJuQRoCRA4YCA6qZHW6xZlFuCQZ+uYDTGxRaPWMuRVh7jD47h7SZz7ztsrCWS816kAWFAKTWQVImr7Jwd+5dk4qCZsqdpHTeVRlfaRZshRIf7Cj5OlhhE1iw6/xda3qekNgNuI3KQDIblDwBlPw56oAI8x6Ov/lcTmr0LQ4Vhxj1zFksriT6aLKX7Z6HG+c="
                  );
                  console.log("Loading interactive example...");
                  const client = new TelegramClient(
                    stringSession,
                    apiId,
                    apiHash,
                    {
                      connectionRetries: 5,
                    }
                  );
                  await client.start({
                    phoneNumber: async () =>
                      await input.text("Please enter your number: "),
                    password: async () =>
                      await input.text("Please enter your password: "),
                    phoneCode: async () =>
                      await input.text("Please enter the code you received: "),
                    onError: (err) => console.log(err),
                  });

                  if (dataa[0].caption && dataa[0].image) {
                    await client.sendFile(info.id, {
                      file: dataa[0].image,
                      caption: dataa[0].caption,
                    });
                  } else if (dataa[0].caption && !dataa[0].image) {
                    await client.sendMessage(info.id, {
                      message: dataa[0].caption,
                    });
                  } else if (dataa[0].image && !dataa[0].caption) {
                    await client.sendFile(info.id, { file: dataa[0].image });
                  } else {
                    return;
                  }
                })();
              }
            });
          }
        });
    } else {
      Mbot.find({})
        .skip(allMsg.length)
        .limit(1)
        .then((datasa) => {
          if (datasa.length > 0) {
            allMsg.push("sent");
            Group.findOne({}, function (err, info) {
              if (err) {
                console.log("err");
              } else if (!info) {
                console.log("err");
              } else {
                (async () => {
                  const stringSession = new StringSession(
                    "1BAAOMTQ5LjE1NC4xNjcuOTEAUEVcSCAdCA7IsNZWAgD4dgf1PN8ciiaY6vFKhvQrKpooq7dzC1UxxzwIssG4+yVxQQ8E8b8yCihqgugHP69zkGyW7DZsSdhlw7nluQRsA3/RLNUZPMki/tXhL6G6/XYXqkSk+k96I9+0rSddL6b0l10KbJuQRoCRA4YCA6qZHW6xZlFuCQZ+uYDTGxRaPWMuRVh7jD47h7SZz7ztsrCWS816kAWFAKTWQVImr7Jwd+5dk4qCZsqdpHTeVRlfaRZshRIf7Cj5OlhhE1iw6/xda3qekNgNuI3KQDIblDwBlPw56oAI8x6Ov/lcTmr0LQ4Vhxj1zFksriT6aLKX7Z6HG+c="
                  );
                  console.log("Loading interactive example...");
                  const client = new TelegramClient(
                    stringSession,
                    apiId,
                    apiHash,
                    {
                      connectionRetries: 5,
                    }
                  );
                  await client.start({
                    phoneNumber: async () =>
                      await input.text("Please enter your number: "),
                    password: async () =>
                      await input.text("Please enter your password: "),
                    phoneCode: async () =>
                      await input.text("Please enter the code you received: "),
                    onError: (err) => console.log(err),
                  });
                  // Save this string to avoid logging in again

                  if (datasa[0].caption && datasa[0].image) {
                    await client.sendFile(info.id, {
                      file: datasa[0].image,
                      caption: datasa[0].caption,
                    });
                  } else if (datasa[0].caption && !datasa[0].image) {
                    await client.sendMessage(info.id, {
                      message: datasa[0].caption,
                    });
                  } else if (datasa[0].image && !datasa[0].caption) {
                    await client.sendFile(info.id, { file: datasa[0].image });
                  } else {
                    return;
                  }
                })();
              }
            });
          }
        });
    }
  });
}
cron.schedule("*/10 * * * *", () => {
  param();
});

async function param() {
  const data = await axios.get("https://randomuser.me/api/");

  const stringSession = new StringSession(
    "1BAAOMTQ5LjE1NC4xNjcuOTEAUEVcSCAdCA7IsNZWAgD4dgf1PN8ciiaY6vFKhvQrKpooq7dzC1UxxzwIssG4+yVxQQ8E8b8yCihqgugHP69zkGyW7DZsSdhlw7nluQRsA3/RLNUZPMki/tXhL6G6/XYXqkSk+k96I9+0rSddL6b0l10KbJuQRoCRA4YCA6qZHW6xZlFuCQZ+uYDTGxRaPWMuRVh7jD47h7SZz7ztsrCWS816kAWFAKTWQVImr7Jwd+5dk4qCZsqdpHTeVRlfaRZshRIf7Cj5OlhhE1iw6/xda3qekNgNuI3KQDIblDwBlPw56oAI8x6Ov/lcTmr0LQ4Vhxj1zFksriT6aLKX7Z6HG+c="
  );
  console.log("Loading interactive example...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  const result = await client.invoke(
    new Api.account.UpdateProfile({
      firstName: data.data.results[0].name.first,
      lastName: data.data.results[0].name.last,
    })
  );
}

// cron.schedule('*/20 * * * *', () => {

//   Activate.find({}).then(data => {
//     if (data.length > 0 && data[0].activated === true) {
//       Mbot.find({ phone: { $exists: 1 }, caption: { $exists: 1 } }).then(data => {

//         if (data.length > 0) {
//           data.forEach(function (mdata) {

//             (async () => {
//               const stringSession = new StringSession('');
//               console.log("Loading interactive example...");
//               const client = new TelegramClient(stringSession, apiId, apiHash, {
//                 connectionRetries: 5,
//               });
//               await client.start({
//                 phoneNumber: async () => await input.text("Please enter your number: "),
//                 password: async () => await input.text("Please enter your password: "),
//                 phoneCode: async () =>
//                   await input.text("Please enter the code you received: "),
//                 onError: (err) => console.log(err),
//               });
//               console.log("You should now be connected.");
//               console.log(client.session.save()); // Save this string to avoid logging in again
//               const result = await client.invoke(new Api.channels.CheckUsername({
//                 username: "testing"
//             }));
//             console.log(result)

//               // if (mdata.caption && mdata.image) {
//               //   await client.sendFile("-1001552882165", { file: mdata.image, caption: mdata.caption });
//               // } else if (mdata.caption && !mdata.image) {
//               //   await client.sendMessage("-1001552882165", { message: mdata.caption });
//               // } else if (mdata.image && !mdata.caption) {
//               //   await client.sendFile("-1001552882165", { file: mdata.image });
//               // } else {
//               //   return;
//               // }

//             })();
//           })

//         }
//       })
//     }
//   })
// })

async function main() {
  // Use connect method to connect to the server

  // return 'done.';

  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.log("Could not connect to the database. Exiting now...", err);
      process.exit();
    });
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

var httpp = http.createServer(app);
httpp.listen(3003, "localhost");

// app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
//   console.log(`Now listening on port ${port}`);
// });
