import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import UserDAO from "../dao/UserDAO"; // si lo usas en algún método

const router = Router();

/**
 * @route GET /users
 * @description Retrieve all users.
 * @access Public
 */
router.get("/", (req: Request, res: Response) => UserController.getAll(req, res));

/**
 * @route POST /users/register
 * @description Register a new user.
 * @access Public
 */
router.post("/register", (req: Request, res: Response) => UserController.register(req, res));

/**
 * @route GET /users/:id
 * @description Retrieve a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Public
 */
router.get("/:id", (req: Request, res: Response) => UserController.read(req, res));

/**
 * @route POST /users
 * @description Create a new user.
 * @body {string} username - The username of the user.
 * @body {string} password - The password of the user.
 * @access Public
 */
router.post("/", (req: Request, res: Response) => UserController.create(req, res));

/**
 * @route PUT /users/:id
 * @description Update an existing user by ID.
 * @param {string} id - The unique identifier of the user.
 * @body {string} [username] - Updated username (optional).
 * @body {string} [password] - Updated password (optional).
 * @access Public
 */
router.put("/:id", (req: Request, res: Response) => UserController.update(req, res));

/**
 * @route DELETE /users/:id
 * @description Delete a user by ID.
 * @param {string} id - The unique identifier of the user.
 * @access Public
 */
router.delete("/:id", (req: Request, res: Response) => UserController.delete(req, res));

export default router;
