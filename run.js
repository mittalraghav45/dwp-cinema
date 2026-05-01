import TicketService from "./src/pairtest/TicketService.js";
import TicketTypeRequest from "./src/pairtest/lib/TicketTypeRequest.js";

const ticketService = new TicketService();

try {
  ticketService.purchaseTickets(
    1,
    TicketTypeRequest.create("ADULT", 2),
    TicketTypeRequest.create("CHILD", 1),
    TicketTypeRequest.create("INFANT", 1)
  );

  console.log("Purchase successful");
} catch (err) {
  console.error("Error:", err.message);
}