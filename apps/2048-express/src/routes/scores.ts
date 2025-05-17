/*Create the routes: submitScore 


*/

import { Router } from "express";
import { submitScore } from "src/controllers/scoresController";
import { authMiddleware } from "src/middlewares/authMiddleware";


const router = Router();

router.post('/submit', authMiddleware, submitScore);

export default router;