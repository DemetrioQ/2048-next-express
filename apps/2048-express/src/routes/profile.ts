import { Router } from 'express';
import { checkUsernameAvailable, resendEmailVerification, updateAvatar, updateUsername, verifyEmail } from 'src/controllers/profileController';
import { authMiddleware } from 'src/middlewares/authMiddleware';
import { verifiedMiddleware } from 'src/middlewares/verifiedMiddleware';
const router = Router();

router.post('/update-avatar', authMiddleware, verifiedMiddleware, updateAvatar)
router.post('/update-username', authMiddleware, verifiedMiddleware, updateUsername)
router.post("/resend-verification", authMiddleware, resendEmailVerification)


router.get("/check-username", checkUsernameAvailable)
router.get("/verify-email", verifyEmail)


export default router;