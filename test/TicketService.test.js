import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

test("should throw error for invalid account ID", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(0, new TicketTypeRequest("ADULT", 1));
  }).toThrow(InvalidPurchaseException);
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
  }).toThrow(InvalidPurchaseException);
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

test("should throw error when no tickets are provided", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(1);
  }).toThrow(InvalidPurchaseException);
});

test("should throw error when child tickets are purchased without adult", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(1, new TicketTypeRequest("CHILD", 1));
  }).toThrow(InvalidPurchaseException);
});

test("should throw error when ticket count is zero", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(1, new TicketTypeRequest("ADULT", 0));
  }).toThrow(InvalidPurchaseException);
});

test("should throw error when infants exceed adults", () => {
  const service = new TicketService();

  expect(() => {
    service.purchaseTickets(
      1,
      new TicketTypeRequest("ADULT", 1),
      new TicketTypeRequest("INFANT", 2)
    );
  }).toThrow(InvalidPurchaseException);
});