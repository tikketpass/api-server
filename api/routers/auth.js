import router from "./index";
import base from "./base";
import * as authController from "./../controllers/auth";

router.post('/auth/send-email-code', authController.sendEmailCode);
router.post('/auth/sign-up', authController.signUp);

export default router;