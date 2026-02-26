const { Router } = require("express");
const ctrl = require("../controllers/reminderController");
const auth = require("../middleware/auth");

const router = Router();

router.use(auth);

router.get("/", ctrl.getAll);
router.post("/", ctrl.create);
router.patch("/:id/toggle", ctrl.toggle);
router.delete("/:id", ctrl.remove);

module.exports = router;
