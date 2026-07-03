import { Router, Response } from "express";
import { authMiddleware, roleGuard, AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema } from "../validations/user.validation";
import * as authService from "../services/auth.service";

const router = Router();

router.use(authMiddleware);
router.use(roleGuard("admin"));

router.get("/", async (_req: AuthRequest, res: Response) => {
  try {
    const users = await authService.findAll();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.findOne(req.params.id);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
});

router.post("/", validate(createUserSchema), async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", validate(updateUserSchema), async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.update(req.params.id, req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const user = await authService.deactivate(req.params.id);
    res.json({ message: "User deactivated", user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
