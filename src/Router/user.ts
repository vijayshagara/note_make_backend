import express from "express";
import checkForUser from '../middleWare/auth.middleware'
const { signUp, login, info,otpGenerate,forgetPassword } = require("../Module/userModule");
const { addNotes, allProducts, singleProducts, deleteProduct,updateProduct } = require('../Module/notesModule')
const router = express.Router();

//user
router.post("/signup", signUp);
router.post("/login", login);
router.get("/info", checkForUser, info);

//product
router.post("/add-notes",checkForUser,addNotes)
router.get("/all-notes",checkForUser, allProducts)
router.get("/notes/:id",  singleProducts)
router.delete("/delete-notes/:id", deleteProduct)
router.put("/update-notes/:id", updateProduct)

// otp generate for password
router.post("/otp-generate", otpGenerate)
router.put("/forget-password", forgetPassword)







export default router;
