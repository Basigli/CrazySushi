// server/index.js
// import * as utils from "./utils.js";
const utils = require("./utils");
const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const cors = require('cors');
const bodyParser = require('body-parser');
// import CryptoJS from 'crypto-js';
const CryptoJS = require('crypto-js');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });


var ordersDict = new Map();
const orderSubscribers = new Map();

const addSubscriber = (orderId, ws) => {
  if (!orderSubscribers.has(orderId)) {
    orderSubscribers.set(orderId, new Set());
  }
  orderSubscribers.get(orderId).add(ws);
};

const removeSubscriber = (orderId, ws) => {
  if (!orderId || !orderSubscribers.has(orderId)) {
    return;
  }
  const subscribers = orderSubscribers.get(orderId);
  subscribers.delete(ws);
  if (subscribers.size === 0) {
    orderSubscribers.delete(orderId);
  }
};

const broadcastOrderUpdate = (orderId) => {
  const subscribers = orderSubscribers.get(orderId);
  if (!subscribers) {
    return;
  }

  const payload = JSON.stringify({
    type: 'order-updated',
    orderId: orderId,
    at: Date.now(),
  });

  subscribers.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
};

wss.on('connection', (ws) => {
  ws.subscribedOrderId = null;

  ws.on('message', (rawMessage) => {
    let message;

    try {
      message = JSON.parse(rawMessage.toString());
    } catch (err) {
      return;
    }

    if (message.type !== 'subscribe-order' || !message.orderId) {
      return;
    }

    if (ws.subscribedOrderId) {
      removeSubscriber(ws.subscribedOrderId, ws);
    }

    ws.subscribedOrderId = message.orderId;
    addSubscriber(message.orderId, ws);
  });

  ws.on('close', () => {
    removeSubscriber(ws.subscribedOrderId, ws);
  });
});



// create a new Order 
app.post("/create", (req, res) => {
    console.log("arrivata richiesta di creazione tavolo da " + req.body.user);

    let orderId = utils.generateId();

    while(ordersDict.has(orderId)) {
      orderId = utils.generateId();
    }
    let order = {};
    order.userCreator = req.body.user;
    order.orderId = orderId;
    order.menu = utils.generateMenu();
    order.users = [req.body.user];
    console.log("created order " + orderId);
    ordersDict.set(orderId, order);
    res.json({ message: orderId });
    console.log(ordersDict);
});
// ----------------------------------------------------------------------------------------------------------------------


// join an Order 
app.post("/join", (req, res) => {
  console.log("arrivata richiesta unione ad un tavolo da " + req.body.user);

  let orderId = req.body.orderId;
  let currentOrder = ordersDict.get(orderId);

  if (!currentOrder) {
    console.log("ordine non esistente");
    orderId = "-1";
  } else {
    currentOrder.users.push(req.body.user);
    ordersDict.set(orderId, currentOrder);
  }


  res.json({ message: orderId });
  console.log(ordersDict);
});
// ----------------------------------------------------------------------------------------------------------------------
app.post("/add", (req, res) => {
  console.log("arrivata richiesta aggiunta piatto da:" + req.body.encryptedUid);

  let orderId = req.body.idOrdine;
  let mealNumber = req.body.idPiatto;
  let qta = req.body.qta;
  let encryptedUid = req.body.encryptedUid;


  let currentOrder = ordersDict.get(orderId);

  if (!currentOrder) {
    console.log("ordine non esistente");
    orderId = "-1";
  } else {
    let currentMenu = currentOrder.menu;      
    let currentMeal = currentMenu.get(mealNumber);    // {"2" => { "userId" => 2}}
    let userQta = currentMeal.get(encryptedUid);

    if (!userQta) {
      userQta = 0;
      userQta += parseInt(qta);
    } else {
      userQta += parseInt(qta);
    }
    currentMeal.set(encryptedUid, userQta);
    currentMenu.set(mealNumber, currentMeal);
    currentOrder.menu = currentMenu;
    ordersDict.set(orderId, currentOrder);
    console.log("piatto aggiunto");
    broadcastOrderUpdate(orderId);
  }


  res.json({ message: orderId });
  console.log(ordersDict);
});
// ----------------------------------------------------------------------------------------------------------------------

app.post("/remove", (req, res) => {
  console.log("arrivata richiesta rimozione piatto da:" + req.body.encryptedUid);

  let orderId = req.body.idOrdine;
  let mealNumber = req.body.idPiatto;
  let qta = req.body.qta;
  let encryptedUid = req.body.encryptedUid;


  let currentOrder = ordersDict.get(orderId);

  if (!currentOrder) {
    console.log("ordine non esistente");
    orderId = "-1";
  } else {
    currentMenu = currentOrder.menu;      
    currentMeal = currentMenu.get(mealNumber);    // {"2" => { "userId" => 2}}
    userQta = currentMeal.get(encryptedUid);
    userQta -= qta;
    if (userQta < 0) {
      userQta = 0;
    }
    currentMeal.set(encryptedUid, userQta);
    currentMenu.set(mealNumber, currentMeal);
    currentOrder.menu = currentMenu;
    ordersDict.set(orderId, currentOrder);
    console.log("piatto rimosso");
    broadcastOrderUpdate(orderId);
  }

  res.json({ message: orderId });
  console.log(ordersDict);
});
// ----------------------------------------------------------------------------------------------------------------------




// get the menu
app.post("/get-menu", (req, res) => {
  console.log("arrivata richiesta visualizzazione menu");
  let menu = utils.getMenu();
  
  res.json({ message: menu });
});
// ----------------------------------------------------------------------------------------------------------------------

app.post("/get-meals", (req, res) => {
  console.log("arrivata richiesta visualizzazione piatti  da" + req.body.user);

  let orderId = req.body.orderId;
  let userId = req.body.user;

  let meals = [];

  let currentOrder = ordersDict.get(orderId);
  
  if (!currentOrder) {
    console.log("ordine non esistente");
    meals.push("-1");
  } else {
    currentMenu = currentOrder.menu;
    currentOrder.menu = currentMenu;
    currentMenu.forEach((value, key) => {
      userQta = value.get(userId);
      if (userQta > 0) {
        meals.push(key);
      }
    });
    
  }   
  res.json({ message: meals });
});
// ----------------------------------------------------------------------------------------------------------------------

app.post("/visualize", (req, res) => {
  console.log("arrivata richiesta visualizzazione ordine  da " + req.body.user);
  // uid = CryptoJS.AES.decrypt(encryptedUid, 'rTCIWU3RYT23r8gcr3rU32TYRVdshfkjfhs32w4Y3').toString(CryptoJS.enc.Utf8);
  
  let orderId = req.body.orderId;
  let userId = req.body.user;

  let result = [];

  let currentOrder = ordersDict.get(orderId);
  
  if (!currentOrder) {
    console.log("ordine non esistente");
    result.push("-1");
  } else {
    let currentMenu = currentOrder.menu;
    currentMenu.forEach((value, key) => {     // "2" => {"user1" => 2, "user2 => 3"}
      let total = 0;
      let rowDetail = '';
      let row = key;
      row += ' &rarr; ';
      rowDetail += ' (';
      value.forEach((value, key) => {
        if (value > 0) {
          rowDetail += ' ';
          rowDetail += CryptoJS.AES.decrypt(key, 'rTCIWU3RYT23r8gcr3rU32TYRVdshfkjfhs32w4Y3').toString(CryptoJS.enc.Utf8);
          rowDetail += ':';
          rowDetail += value;
          total += value;
        }
      });
      row += total + rowDetail;
      row += ' )';
      if (total > 0) {
        result.push(row);
      }
    });
    
  }   
  res.json({ message: result });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});