import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

console.log(`PORT===>`, PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.all("/*", (res, req) => {
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log(req);
  console.log(`UUUUUUUUUUUURRRRRRRRRRLLLLLLLLLL==>${req.url}`);

  console.log("originalURL===>", req.originalUrl);
  console.log("originalURL1===>", JSON.stringify(req.originalUrl));
  console.log("originalURL2===>", JSON.parse(req.originalUrl));
  console.log("method===>", req.method);
  console.log("body===>", req.body);

  const recipient = req.originalUrl.split("/")[1];
  console.log("recipient", recipient);

  const recipientURL = process.env[recipient];
  console.log("recipientURL", recipientURL);

  if (recipientURL) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientURL}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    };

    console.log("axiosConfig", axiosConfig);

    axios(axiosConfig)
      .then(function (response) {
        console.log("response from recipient", response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.log("some error", JSON.stringify(error));

        if (error.response) {
          const { status, data } = error.response;
          res.status(status).json(data);
        } else {
          res.status(501).json(`error: error.messagewwwwwwwwwwwwwwwwwww`);
          // res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: "Cannot process request" });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
