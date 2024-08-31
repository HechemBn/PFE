// Importing the packages required for the project.
// {alter:true }
const express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());
/* app.use(express.static(path.join(__dirname, "../client/build"))); */
// Used for sending the Json Data to Node API
app.use(express.json());

/* sequelize.sync({alter:true}) cette commande pour alter table dans n import model*/
app.use("/role/", require("./controller/roleController"));
app.use("/user/", require("./controller/userController"));
app.use("/sendMail", require("./controller/sendMailController"))
app.use("/settings/", require("./controller/settingsController"));
app.use("/notification/", require("./controller/notificationController"));
app.use("/root/", require("./controller/rootController"));


/* app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});  */

const PORT = 4000 || 5000 || 6000;
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`app listening on port ${PORT}!`)
);
