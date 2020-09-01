import router from "./index";
import base from "./base";
import * as concertController from "./../controllers/concert";

router.post('/concert', base.protectRoute(["HOST"]), concertController.createConcert);

export default router;