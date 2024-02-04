const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT, async () => {
  console.log("BACKEND RUNNING ON :", process.env.PORT);
});

app.get("/", (req, res) => {
  res.send("Working");
});

app.post("/api/v1/getdetails", async (req, res) => {
  cities = req.body.cities;

  const resp = {};

  const apiKey = "e9d615fad0b99fc2a6bf9ca3b7da9817";
  let count = 0;
  try {
    for (let i = 0; i < cities.length; i++) {
      const currentWeatherUrl = `${process.env.API_URI}q=${cities[i]}&appid=${process.env.API_KEY}`;

      await fetch(currentWeatherUrl)
        .then((response) => response.json())
        .then((data) => {
          
          resp[cities[i]] = `${data.main.temp}`;
          console.log(resp);
        })
        .catch((error) => {
          count++;
          resp[cities[i]] = "city not found";
        });
    }

    count < cities.length
      ? res.status(200).json(resp)
      : res.status(401).json({
          msg: "failed",
        });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      msg: "failed",
    });
  }
});
