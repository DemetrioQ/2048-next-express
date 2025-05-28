/*Create the routes: submitScore 


*/

import { Router } from "express";
import { submitScore } from "src/controllers/scoresController";
import { authMiddleware } from "src/middlewares/authMiddleware";
import { verifiedMiddleware } from "src/middlewares/verifiedMiddleware";


const router = Router();

router.post('/submit', authMiddleware, verifiedMiddleware, submitScore);

export default router;