import express from "express";
import rumahTanggaController from "../controllers/rumahTanggaController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, rumahTanggaController.addRumahTangga);
router.put("/:kode", authMiddleware, rumahTanggaController.updateRumahTangga);
router.delete("/:kode", authMiddleware, rumahTanggaController.deleteRumahTangga);
router.get("/:kode", authMiddleware, rumahTanggaController.getRumahTanggaByKode);
router.get("/", rumahTanggaController.getAllRumahTangga);

export default router;