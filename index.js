import { Resend } from "resend";
import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const app = express();
const jsonParser = bodyParser.json();

app.use(
  cors({
    origin: "beeyondcreative.org",
  })
);

app.post("/mail", jsonParser, async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, phone, website, message } = req.body;
    const data = await resend.emails.send({
      from: "Contact Form <contact@beeyondcreative.org>",
      to: ["abeeha@beeyondcreative.org"],
      subject: "Contact Form Submission from the Beeyond Creative Website",
      reply_to: email,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany Website: ${website}\nMessage: ${message}`,
      html:
        "<div><p>Name: " +
        name +
        "</p>" +
        "<p>Email: " +
        email +
        "</p>" +
        "<p>Phone: " +
        phone +
        "</p>" +
        "<p>Company Website: " +
        website +
        "</p>" +
        "<p>Message: " +
        message +
        "</p></div>",
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  if (!process.env.RESEND_API_KEY) {
    throw `Abort: You need to define RESEND_API_KEY in the .env file.`;
  }

  console.log("Listening on http://localhost:3000");
});
