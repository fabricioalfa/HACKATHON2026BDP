import { Router, Response } from "express";
import { authMiddleware, roleGuard, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { issueCertificateSchema } from "../validations/certificate.validation";
import * as certService from "../services/certificate.service";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const certs = await certService.findAll(req.user?.userId, req.user?.role);
    res.json(certs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const cert = await certService.findOne(req.params.id);
    res.json(cert);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/", roleGuard("admin", "officer"), validate(issueCertificateSchema), async (req: AuthRequest, res: Response) => {
  try {
    const cert = await certService.issueCertificate(req.body, req.user!.userId, req.user!.role);
    res.status(201).json(cert);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id/revoke", roleGuard("admin", "officer"), async (req: AuthRequest, res: Response) => {
  try {
    const cert = await certService.revokeCertificate(req.params.id, req.user!.userId, req.user!.role);
    res.json(cert);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/:id/validate", async (req: AuthRequest, res: Response) => {
  try {
    const result = await certService.validateCertificate(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
