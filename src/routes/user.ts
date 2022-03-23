import express from "express";
import {
  authUser,
  registerUser,
  allUsers,
  getToken,
} from "../controllers/userControllers";
import { protect } from "../middlewares/authMiddleware";
const router = express.Router();

router.route("/").get(protect, allUsers);
// router.route("/").post(registerUser).get(protect, allUsers);

// router.post("/login", authUser);

router.post("/token", getToken);

export default router;
