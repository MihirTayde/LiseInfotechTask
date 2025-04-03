import express, { Router } from "express";
import configDB from "./src/config/configDB.js";
import "dotenv/config";
import { adminLogin, adminLogOut } from "./src/controller/authController.js";
import { isAdmin } from "./src/middleware/isAdmin.js";
import cors from "cors";

// admin login ki alag api banani hai for CRUD operation

const app = express();
const router = express.Router();
app.use(cors());

const PORT = process.env.PORT || 4500;

app.listen(PORT);
console.log(`server is running on PORT ${PORT}`);

configDB();

app.get("/", (req, res) => {
  try {
    res.send("Hi there");
  } catch (error) {
    console.log(error);
  }
});

router.get("/adminDashboard", isAdmin);

router.post("/adminLogin", adminLogin);
router.post("/adminLogout", adminLogOut);

// add pokemon
// delete pokemon
// list all pokemon
// edit pokemon
