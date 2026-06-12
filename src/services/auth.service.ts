import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

export class AuthService {
    static async validateLogin(email: string, pass: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) return null;

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '2h' }
        );

        return {
            token,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }
}