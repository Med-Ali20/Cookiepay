const express = require("express");
const fs = require("fs");
const axios = require("axios");
const app = express();
require('dotenv').config()

app.use(express.json());

app.post("/createPayment", async (req, res) => {
  try {
    const { productName, amount, buyerName, buyerEmail, buyerPhone } = req.body;
    const orderNumber = parseInt(Math.random() * 1000000000);

    const reqBody = {
      API_ID: process.env.API_ID,
      ORDERNO: orderNumber,
      PRODUCTNAME: productName,
      AMOUNT: amount,
      BUYERNAME: buyerName,
      BUYEREMAIL: buyerEmail,
      BUYERPHONE: buyerPhone,
      RETURNURL: "https://www.google.com",
    };

    const response = await axios.post(
      "https://www.cookiepayments.com/pay/ready",
      reqBody,
      {
        headers: {
          ApiKey: process.env.API_KEY
        },
      }
    );

    console.log(response);
    fs.writeFile(`public/${orderNumber}.html`, response.data, () => {
      console.log("written");
    });
    app.use(express.static("public"));
    res.status(200).json({url: `https://cookiepay.onrender.com/${orderNumber}.html`});
  } catch (error) {
    console.log(error);
    res.status(400).json("Payment Error");
  } 
});

app.listen(5000, () => {
  console.log("app is running");
});
