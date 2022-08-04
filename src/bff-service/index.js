import axios from "axios";
import express, { response } from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all("/*", (res, req) => {
  console.log("originalURL", originalURL);
  console.log("method", req.method);
  console.log("body", req.body);

  const recipient = req.originalURL.split("/")[1];
  console.log("recipient", recipient);

  const recipientURL = process.env[recipient];
  console.log("recipientURL", recipientURL);

  if (recipientURL) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientURL}${req.originalURL}`,
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
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: "Cannot process request" });
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
