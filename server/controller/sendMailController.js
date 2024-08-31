const express = require("express");
const crypto = require("crypto");
var user = require("../models/user");
const router = express.Router();
var nodemailer = require("nodemailer");

router.post("/sendEmail", async (req, res) => {
  var email = req.body.email;
  var code = Math.floor(1000 + Math.random() * 9000);
  var t = code + "_" + email;
  var codem = Buffer.from(t).toString("base64");
  var link = "http://localhost:8000/" + "resetPassword/" + codem;
  try {
    var sujet = "Mot de passe oublié";
    var msg = "";
    var nom = "";

    var userFound = await user.findOne({
      where: { email: email },
      attributes: ["nom_prenom"],
    });
    if (!userFound) {
      return res.status(403).send(false);
    } else {
      user.update({ code: code }, { where: { email: email } });
      nom = userFound.dataValues.nom_prenom;
      sendMail(sujet, msg, email, nom, link);
      return res.status(200).send(true);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Une erreur s'est produite.");
  }
});

const sendMail = function (sujet, msg, mail, nom, link) {
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "application.mailerr@gmail.com",
        pass: "qwakhrxbolhobxea",
      },
      starttls: {
        enable: true,
      },
      secureConnection: true,
      rejectUnauthorized: false,
    });

    message = {
      from: "application.mailerr@gmail.com",
      to: mail,
      subject: sujet,
      html: `
        <table style="width:500px;padding:20px; font-family:calibri;  margin:0 auto; color:#263476; 
        border:1px solid rgb(0, 165, 231);">
          <tr>
              <td colspan="4" style="text-align:center;">
                  <h1> SUIVI PROJET </h1>
              </td>
          </tr>
          <tr>
              <td colspan="3"
                  style="padding-top:15px;text-align:center; font-size:12px; border-top:1px dashed rgb(0, 165, 231); ">
              </td>
          </tr>
          <tr>
              <td><strong>Bonjour ${nom} Vous avez demandé à recevoir cet email afin de réinitialiser votre mot de passe associé à votre compte .</div><div style='margin:4px; text-align:justify;'>Si vous n'êtes pas à l'origine de cette demande, nous vous prions d'ignorer cet email.</div> <div style='margin:4px; text-align:justify;'>Si vous en êtes à l’origine, veuillez tenir compte des instructions suivantes.
              Afin de réinitialiser votre mot de passe, nous vous invitions à cliquer sur le bouton ci-dessous :</div> <div style='margin:4px; padding:10px; border-top:1px solid #f1f1f1; text-align:justify;'><center><a style='display:inline-block; padding:10px; width:280px;font-size:15px; color:#fff; background:blue; ' href="${link}">
              Je réinitialise mon mot de passe</a></center></div><div style='margin:4px; text-align:justify;'>Si le bouton semble ne pas fonctionner, copiez le lien suivant et collez-le dans la barre d'adresse de votre navigateur : <span style='color:#5F5F5F'>"${link}"</span></div></div><div style='margin:2px; text-align:justify;'>Vous serez redirigé vers <span style='color :green'>"SUIVI PROJET" </span>
              et vous pourrez ainsi modifier votre mot de passe en toute sécurité.</div> <div style='margin:4px; text-align:justify;'>Pour des questions de sécurité, le lien est valide pendant une durée maximale de 24h, passé ce délai vous devrez faire une nouvelle demande.<br /><br /><br />Merci pour votre confiance. <br />À 
              </div></div></center> , </strong></td>
          </tr>
        </table>
      `,
    };
    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error);
      } else {
      }
    });
  } catch (error) {
    console.log(error);
  }
};

router.post("/resetPassword", async (req, res) => {
  var code = req.body.code;
  const decode = Buffer.from(code, "base64").toString();
  const parts = decode.split("_");
  const codee = parts[0];
  const email = parts[1];

  var userFound = await user.findOne({
    where: { email: email },
    attributes: ["code"],
  });
  if (!userFound) {
    return res.status(403).send(false);
  } else {
    if (userFound.dataValues.code === codee) {
      return res.status(200).send({ email: email });
    } else {
      return res.status(403).send(false);
    }
  }
});

module.exports = router;
