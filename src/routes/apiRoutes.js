const express = require("express");

const userController = require("../controllers/userController.js");
const transactionController = require("../controllers/transactionController.js");

const router = express.Router();

router.get("/users", userController.getAllUser);

router.get("/users/:id", userController.getUserById);

router.get("/transactions", transactionController.getAllTransactions);

router.post("/transactions", transactionController.createTransactions);

router.put("/transactions/:id", transactionController.updateTransaction);

router.delete("/transactions/:id", transactionController.deleteTransaction);

router.get(
  "/transactions/user/:userId",
  transactionController.getTransactionsByUser
);

module.exports = router;
