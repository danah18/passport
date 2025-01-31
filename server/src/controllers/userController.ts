// src/controllers/userController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import { asyncHandler } from '../middleware/asyncHandler';

/**
 * Controller for handling user-related operations.
 */
export class UserController {
    /**
     * Creates a new user.
     * @route POST /api/users
     * @returns 201 Created - The newly created user.
     * @returns 400 Bad Request - If the email is missing.
     */
    public createUser = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const newUser = await User.create({ email });
        res.status(201).json(newUser);
    });

    /**
     * Retrieves all users.
     * @route GET /api/users
     * @returns 200 OK - A list of all users.
     */
    public getAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const users = await User.find({});
        res.json(users);
    });

    /**
     * Retrieves a single user by ID.
     * @route GET /api/users/:userId
     * @returns 200 OK - The requested user.
     * @returns 404 Not Found - If the user does not exist.
     */
    public getUserById = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    });
}

export const userController = new UserController();
