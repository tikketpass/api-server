import router from "./index";
import base from "./base";
import * as concertController from "./../controllers/concert";
import { upload } from "../services/concert";

router.post('/concerts', base.protectRoute(["HOST"]), concertController.createConcert);
router.get('/concerts/:concertId', base.protectRoute(["HOST"]), concertController.getConcert);
router.put('/concerts/:concertId', base.protectRoute(["HOST"]), upload.fields([{ name: "topImage" }, { name: "bottomImage" }]), concertController.updateConcert);
router.get('/users/:userId/concerts', base.protectRoute(["HOST"]), concertController.getMyConcerts);
export default router;