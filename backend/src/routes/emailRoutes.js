const { Router } = require("express");
const ctrl = require("../controllers/emailController");
const auth = require("../middleware/auth");

const router = Router();

router.use(auth);

router.post("/send/:clientId", ctrl.sendToClient);
router.post("/whatsapp", ctrl.whatsappLink);

module.exports = router;
