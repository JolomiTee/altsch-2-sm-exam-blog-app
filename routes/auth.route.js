const express = require("express");
const router = express.Router();
const { signUp, logIn, logOut } = require("../controllers/auth.controller");

router.get("/signup", (req, res) =>
	res.render("auth/signup", { user: req.user })
);
router.get("/login", (req, res) =>
	res.render("auth/login", { user: req.user })
);

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/logout", logOut);

module.exports = router;
