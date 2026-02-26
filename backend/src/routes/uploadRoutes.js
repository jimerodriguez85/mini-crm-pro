const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const ctrl = require("../controllers/uploadController");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
});

const router = Router();

router.use(auth);

router.post("/client/:clientId", upload.single("file"), ctrl.uploadFile);
router.get("/client/:clientId", ctrl.getFiles);
router.get("/:id/download", ctrl.downloadFile);
router.delete("/:id", ctrl.deleteFile);

module.exports = router;
