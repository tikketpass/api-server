import router from "./index";
import base from "./base";
import * as concertController from "./../controllers/concert";

router.post('/concerts', base.protectRoute(["HOST"]), concertController.createConcert);
router.get('/concerts/:concertId', base.protectRoute(["HOST"]), concertController.getConcert);

export default router;