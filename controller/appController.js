const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const ejs = require("ejs");
const emailData = require("../data/emailData.json");
const fs = require("fs");

/** send mail from testing account */
const signup = async (req, res) => {
  try {
    let withoutSkills = [ "Technical Operations Engineer", "Industrial Designer","Business Operations Associate", "Business Strategy Associate", "IT Network Engineer", "IT Support", "Talent Acquisition Associate", "People Operations Executive" ]
    let { name, position } = req.body;
   
    name = name.trim();
    const trimmedPosition = position.trim();
    const emailBody = emailData.find((email) =>
      email.position.includes(trimmedPosition)
    );
    if (!name || !emailBody) {
      throw new Error("Invalid name or position");
    }
    if (withoutSkills.includes(position)){
      emailBody.withoutskill = true;
    }else{
      emailBody.withoutskill = false;
    }

    emailBody.name = name;
    console.log(emailBody)
    const timing = trimmedPosition.includes("Intern") ? "Intern" : "Full Time";
    const subject = `${name} - ${trimmedPosition} - ${timing}`;

    const template = fs.readFileSync("./templates/emailtemplate.ejs", "utf-8");
    const renderedTemplate = ejs.render(template, emailBody);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shoaibnaseer1111@gmail.com",
        pass: "nkjkcsbjkaiatqre",
      },
    });

    const message = {
      from: "careers@cowlar.com",
      to: "shoaib.naseer.cowlar@gmail.com",
      subject: subject,
      html: renderedTemplate,
    };

    const info = await transporter.sendMail(message);

    return res.status(201).json({
      msg: "You should receive an email",
      info: info.messageId,
      preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/** send mail from real gmail account */
const getbill = (req, res) => {
  const { userEmail } = req.body;

  let config = {
    service: "gmail",
    auth: {
      user: "shoaibnaseer1111@gmail.com ",
      pass: "nkjkcsbjkaiatqre",
    },
  };

  let transporter = nodemailer.createTransport(config);

  let MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: "Daily Tuition",
      intro: "Your bill has arrived!",
      table: {
        data: [
          {
            item: "Nodemailer Stack Book",
            description: "A Backend application",
            price: "$10.99",
          },
        ],
      },
      outro: "Looking forward to do more business",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: EMAIL,
    to: userEmail,
    subject: "Place Order",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "you should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  // res.status(201).json("getBill Successfully...!");
};

module.exports = {
  signup,
  getbill,
};
