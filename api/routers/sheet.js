import router from "./index";
import base from "./base";
import * as sheetController from "./../controllers/sheet";

router.post('/sheet/:spreadsheetId/sync', base.protectRoute(["HOST"]), sheetController.sync);
// router.get('/sheet/:spreadsheetId', base.protectRoute(["HOST"]), sheetController)

export default router;
