import TicketService from "./src/pairtest/TicketService.js";
import TicketTypeRequest from "./src/pairtest/lib/TicketTypeRequest.js";

const ticketService = new TicketService();

try {
  ticketService.purchaseTickets(1,
    new TicketTypeRequest("ADULT", 0),
    new TicketTypeRequest("CHILD", 1),
    new TicketTypeRequest("INFANT", 1)
  );

  console.log("Purchase successful");
} catch (err) {
  console.error("Error:", err.message);
}