const { Router } = require("express");
const ctrl = require("../controllers/clientController");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

const router = Router();

router.use(auth);

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.patch("/:id/pipeline", ctrl.updatePipeline);
router.delete("/:id", requireRole("admin"), ctrl.remove);

module.exports = router;
