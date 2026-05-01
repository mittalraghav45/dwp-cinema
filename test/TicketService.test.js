import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";


// test case to check invalid id

test("check for valid account id",()=>{
const service = new TicketService();

expect(()=>{
    service.purchaseTickets(0,new TicketTypeRequest("ADULT", 1));
}).not.toThrow();
})