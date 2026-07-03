import { Router, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", validate(registerSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body.username, req.body.password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
});

export default router;
