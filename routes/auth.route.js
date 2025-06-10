const express = require("express");
const router = express.Router();
const { signUp, logIn, logOut } = require("../controllers/auth.controller");

router.post("/signup", signUp);
router.post("/login", logIn);

router.post("/logout", logOut);

module.exports = router;
