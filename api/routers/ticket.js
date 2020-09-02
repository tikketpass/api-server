import router from "./index";
import base from "./base";
import * as ticketController from "./../controllers/ticket";

router.get('/users/:userId/tickets', base.protectRoute(["HOST", "PARTICIPANT"]), ticketController.getMyTickets);
router.post('/users/:userId/use-ticket', base.protectRoute(["HOST", "PARTICIPANT"]), ticketController.useTicket);

export default router;