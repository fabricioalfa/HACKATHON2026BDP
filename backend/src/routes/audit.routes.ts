import { Router, Response } from "express";
import { authMiddleware, roleGuard, AuthRequest } from "../middleware/auth";
import * as auditService from "../services/audit.service";

const router = Router();

router.use(authMiddleware);
router.use(roleGuard("admin"));

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const logs = await auditService.findAll(
      req.query.userId as string,
      req.query.action as string
    );
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
