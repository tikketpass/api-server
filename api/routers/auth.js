import router from "./index";
import base from "./base";
import * as authController from "./../controllers/auth";

router.post('/auth/send-email-code', authController.sendEmailCode);
router.post('/auth/sign-up', authController.signUp);
router.post('/auth/sign-in', authController.signIn);

export default router;