import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { ROLES } from "../constants/roles.constants";
import * as imageController from "../controllers/image.controller";
import multer from "multer";

const router = Router();

router.use(authenticate)

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!") as any, false);
    }
  },
});

// This route is protected and uses Multer
// 'image' is the field name in the form-data
router.post(
  "/image",
  authenticate,
  upload.single("image"), // <-- Multer middleware runs here
  imageController.saveImageAndGetUrl // <-- Controller runs after
);

export default router;