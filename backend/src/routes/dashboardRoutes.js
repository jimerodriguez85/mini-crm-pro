const { Router } = require("express");
const ctrl = require("../controllers/dashboardController");
const auth = require("../middleware/auth");

const router = Router();

router.use(auth);

router.get("/stats", ctrl.getStats);

module.exports = router;
