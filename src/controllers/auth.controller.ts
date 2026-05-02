import type {Request, Response} from 'express';
import { AuthService } from '../services/auth.service.js';
import {loginSchema} from "../schemas/auth.schema.js";

export const loginController = async (req: Request, res: Response) => {
    try {
        const parsed = loginSchema.parse(req.body);
        const { email, password } = parsed;

        const result = await AuthService.validateLogin(email, password);

        if (!result) {
            return res.status(401).json({ error: "Incorrect email or password" });
        }

        return res.json(result);
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};