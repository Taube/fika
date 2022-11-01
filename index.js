import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const sendMail = async (msg, res) => {
  try {
    const message = "Message sent successfully!";
    await sgMail
      .send(msg)
      .then((response) => {
        console.log(message);
        console.log(response[0].statusCode);
        // console.log(response[0].headers);
        return res.send({ success: true, message: message });
      })
      .catch((error) => {
        console.error("error", error);
        return res.send({ success: false, message: error });
      });
  } catch (error) {
    console.error("error", error);
  }
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toEmail = "10.leo.taube@gmail.com";
const fromEmail = "10.leo.taube@gmail.com";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/send", (req, res) => {
  const body = req.body;
  const { fullName, email, phone, address, order, date, time } = body;

  const text = `
  Ny beställning från:
  Namn: ${fullName}
  E-post: ${email}
  Telefon: ${phone}
  Address: ${address}
  Datum: ${date}
  Tid: ${time}
  
  ${order}
  `;

  const emailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: `Ny beställning från ${fullName}`,
    text: text,
  };

  var response = sendMail(emailOptions, res);
  return response;
});

// Set upp folders that serve static files
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/styles", express.static(path.join(__dirname, "styles")));

app.listen(port, () => {
  console.log(`Express listening at http://localhost:${port}`);
});
