const { Router } = require("express");
const ctrl = require("../controllers/activityController");
const auth = require("../middleware/auth");

const router = Router();

router.use(auth);

router.get("/", ctrl.getAll);
router.get("/client/:clientId", ctrl.getByClient);

module.exports = router;
