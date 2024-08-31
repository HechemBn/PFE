const express = require("express");
const router = express.Router();
var roles = require("../models/role");
var user = require("../models/user");
const jwt = require("jsonwebtoken");
const privateKey = "mySecretKeyabs";
const multer = require("multer");
var bcrypt = require("bcrypt");
const auth = require("../middlewares/passport");
const { Sequelize, Op } = require('sequelize');
var fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/signature");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/saveSignature", auth, upload.single("signature"), (req, res) => {
  if (typeof req.file != "undefined") res.send({ filename: req.file.filename });
  else res.send({ filename: "" });
});

router.post("/updateProfile", auth, (req, res) => {
  var id = req.body.id;
  user.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      var password = "";
      if (req.body.password == "") {
        password = r1.password;
      } else {
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(req.body.password, salt);
      }
      user
        .update(
          {
            nom_prenom: req.body.nom,
            login: req.body.login,
            tel: req.body.tel,
            password: password,
            etat: 1,
          },
          { where: { id: id } }
        )
        .then((u2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/addUser", auth, (req, res) => {
  var id = req.body.id;
  user
    .findOne({ where: { login: req.body.login, id: { [Op.ne]: id } } })
    .then(function (r1) {
      if (!r1 || r1.login != req.body.login) {
        if (id == 0) {
          user
            .create({
              nom_prenom: req.body.nom,
              login: req.body.login,
              email: req.body.email,
              tel: req.body.tel,
              id_role: req.body.role,
              password: req.body.password,
              etat: 1,
            })
            .then((u) => {
              return res.status(200).send(true);
            })
            .catch((error) => {
              return res.status(400).send(error);
            });
        } else {
          user.findOne({ where: { id: id } }).then(function (r1) {
            if (!r1) {
              return res.status(400).send(false);
            } else {
              var password = "";
              if (req.body.password == "") {
                password = r1.password;
              } else {
                const salt = bcrypt.genSaltSync();
                password = bcrypt.hashSync(req.body.password, salt);
              }
              user
                .update(
                  {
                    nom_prenom: req.body.nom,
                    login: req.body.login,
                    email: req.body.email,
                    tel: req.body.tel,
                    id_role: req.body.role,
                    password: password,
                    etat: 1,
                  },
                  { where: { id: id } }
                )
                .then((u) => {
                  if (req.body.role == 5) {
                    userType
                      .destroy({
                        where: { id_user: id },
                      })
                      .then((doc) => {
                        req.body.typeSelect.forEach((element) => {
                          userType.create({
                            id_user: id,
                            id_type: element.value,
                          });
                        });
                      });
                  }
                  return res.status(200).send(true);
                })
                .catch((error) => {
                  return res.status(400).send(false);
                });
            }
          });
        }
      } else {
        return res.status(403).send(false);
      }
    });
});

router.put("/changeEtat/:id", auth, (req, res) => {
  var id = req.params.id;
  user.findOne({ where: { id: id } }).then(function (u) {
    var etat = 0;
    if (u.dataValues.etat == 0) etat = 1;
    if (!u) {
      return res.status(403).send(false);
    } else {
      user
        .update(
          {
            etat: etat,
          },
          { where: { id: id } }
        )
        .then((r2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/allUser", auth, (req, res) => {
  user
    .findAll({
      include: ["roles"],
      order: [["id", "desc"]],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.post("/getActive", auth, (req, res) => {
  user
    .findAll({
      where: { etat: 1 },
      include: ["roles"],
    })
    .then(function (r) {
      return res.status(200).send(r);
    });
});

router.delete("/deleteUser/:id", auth, (req, res) => {
  var id = req.params.id;
  user.findOne({ where: { id: id } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      user
        .destroy({ where: { id: id } })
        .then((u2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});

router.post("/getUser", auth, (req, res) => {
  var id = req.headers["id"];
  user.findOne({ where: { id: id } }).then(function (u1) {
    if (!u1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(u1.dataValues);
    }
  });
});

router.get("/getTypeUser/:id", auth, (req, res) => {
  userType.findAll({ where: { id_user: req.params.id } }).then(function (u1) {
    if (!u1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(u1);
    }
  });
});

router.get("/getServiceUser/:id", auth, (req, res) => {
  user
    .findAll({ where: { id_service: req.params.id, id_role: 7 } })
    .then(function (u1) {
      if (!u1) {
        return res.status(403).send(false);
      } else {
        return res.status(200).json(u1);
      }
    });
});

router.get("/getUserService/:id", auth, (req, res) => {
  user.findAll({ where: { id_service: req.params.id } }).then(function (u1) {
    if (!u1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(u1);
    }
  });
});

router.get("/getResponsable/:role", auth, (req, res) => {
  user.findAll({ where: { id_role: req.params.role } }).then(function (u1) {
    if (!u1) {
      return res.status(403).send(false);
    } else {
      return res.status(200).json(u1);
    }
  });
});

router.post("/login", (req, res) => {
  var login = req.body.login;
  var password = req.body.password;
  user
    .findOne({
      include: ["roles"],
      where: { login: login, etat: 1 },
    })
    .then(function (u1) {
      if (!u1) {
        /* return res.status(403).send(false); */
        res.status(401).send({ message: "Utilisateur n'est pas Existe" });
      } else if (!u1.validPassword(password)) {
        res
          .status(401)
          .send({ message: "Verfier votre Login et Mot de passe!" });
        /* return res.status(403).send(false); */
      } else {
        var code = Math.floor(Math.random() * 1000) + 1000;
        const payload = {
          //login: newdata.login,
          id: u1.dataValues.id,
          random: code,
        };
        const token = jwt.sign(payload, privateKey, {});
        user
          .update(
            {
              token: token,
              code: code,
            },
            { where: { id: u1.dataValues.id } }
          )
          .then((u2) => {
            return res
              .status(200)
              .send({ data: u1.dataValues, token: token, message: true });
          })
          .catch((error) => {
            return res.status(403).send(false);
          });
        /* var idDoc = 0;
          var type = [];
          var docu = [];
          userDocument.findAll({ where: {id_user:u1.dataValues.id,date:{[Op.ne]:null } }}).then(function (doc) {            
              if(doc!=null) {
                idDoc=  doc.length;
                doc.forEach(e=>{
                  if(e.dataValues.etat == 0) type.push(e.dataValues.type)
                  docu.push(e.dataValues.id_document)
                })
              }
        
            const payload = {
              userauth: u1.dataValues,
              userDoc:idDoc,
              userType:type,
              docu:docu
            };
            const token = jwt.sign(payload, privateKey, {
              //   expiresIn: "2h",
            }); 
            return res.status(200).send({ data: u1.dataValues, token: token,message:true });
          
            }); */
      }
    })
    .catch((error) => {
      return res.status(500).send(false);
    });
});

router.get("/getDetailUser/:id", auth, async (req, res) => {
  var id = req.params.id;
  try {
    var findUser = await user.findOne({
      include: ["roles"],
      where: { id: id },
    });
    return res.status(200).send({
      data: {
        user: findUser.dataValues,
      },
      message: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: error });
  }
});


router.get("/verification", auth, (req, res) => {
  var token = req.headers["x-access-token"];
  const decoded = jwt.verify(token, privateKey);
  user
    .findOne({ where: { token: token, id: decoded.id, code: decoded.random } })
    .then((e) => {
      if (e) {
        return res.status(200).send(e);
      } else {
        user.update(
          {
            token: null,
          },
          { where: { id: decoded.id } }
        );
        return res.status(200).send(false);
      }
    });
});

router.get("/getFile/:file", (req, res) => {
  if (fs.existsSync("./upload/signature/" + req.params.file)) {
    var file = fs.createReadStream("./upload/signature/" + req.params.file);
    file.pipe(res);
  } else return res.status(403).json({ message: false });
});


router.put("/changePassword", (req, res) => {
  var email = req.body.email;
  user.findOne({ where: { email: email } }).then(function (r1) {
    if (!r1) {
      return res.status(403).send(false);
    } else {
      var password = "";
      if (req.body.password == "") {
        password = r1.password;
      } else {
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(req.body.password, salt);
      }
      user
        .update(
          {
            password: password,
          },
          { where: { email: email } }
        )
        .then((u2) => {
          return res.status(200).send(true);
        })
        .catch((error) => {
          return res.status(403).send(false);
        });
    }
  });
});



router.post("/allUserForTestMail", auth, (req, res) => {
  const id = req.body.id;
  const email = req.body.email;

  if (id === 0) {
    user.findAll({
      include: ["roles"],
      order: [["id", "desc"]],
      where: Sequelize.literal(`BINARY email = '${email}'`),
    })
      .then(function (result) {
        if (!result || result.length === 0) {
          return res.status(200).send(false);
        } else {
          return res.status(200).send(true);
        }
      })
      .catch(function (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
      });
  } else {
    user.findAll({
      include: ["roles"],
      order: [["id", "desc"]],
      where: {
        [Sequelize.Op.and]: [
          { id: { [Sequelize.Op.ne]: id } },
          Sequelize.literal(`BINARY email = '${email}'`),
        ],
      },
    })
      .then(function (result) {
        if (!result || result.length === 0) {
          return res.status(200).send(false);
        } else {
          return res.status(200).send(true);
        }
      })
      .catch(function (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
      });
  }
});



module.exports = router;