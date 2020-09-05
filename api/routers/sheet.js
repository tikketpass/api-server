import router from "./index";
import base from "./base";
import * as sheetController from "./../controllers/sheet";

router.get('/sheet/:spreadsheetId/sync', base.protectRoute(["HOST"]), sheetController.sync);

export default router;
