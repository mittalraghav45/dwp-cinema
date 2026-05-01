import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

// test case to check invalid id
test("check for valid account id", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(0, new TicketTypeRequest("ADULT", 1));
  }).not.toThrow();
});

test("should process a valid purchase successfully", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(
      1,
      new TicketTypeRequest("ADULT", 1),
      new TicketTypeRequest("INFANT", 1),
      new TicketTypeRequest("CHILD", 1),
    );
  }).not.toThrow();
});

test("should allow purchase of a maximum of 25 tickets", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(1, new TicketTypeRequest("ADULT", 26));
  }).not.toThrow();
});

test("should test for proper amount and number of seats", () => {
  const service = new TicketService();
  let paidAmount;
  let reservedSeats;
  service.paymentService.makePayment = (accountId, amount) => {
    paidAmount = amount;
  };

  service.seatReservationService.reserveSeat = (accountId, seats) => {
    reservedSeats = seats;
  };

  service.purchaseTickets(
    10,
    new TicketTypeRequest("ADULT", 1),
    new TicketTypeRequest("CHILD", 1),
    new TicketTypeRequest("INFANT", 1),
  );

  expect(paidAmount).toBe(40);
  expect(reservedSeats).toBe(2);
});
