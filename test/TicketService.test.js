import TicketService from "../src/pairtest/TicketService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  let service;

  beforeEach(() => {
    service = new TicketService();
  });


  describe("Input Validation", () => {
    test("should throw error for invalid account ID", () => {
      expect(() => {
        service.purchaseTickets(0, new TicketTypeRequest("ADULT", 1));
      }).toThrow(InvalidPurchaseException);
    });

    test("should throw error when no tickets are provided", () => {
      expect(() => {
        service.purchaseTickets(1);
      }).toThrow(InvalidPurchaseException);
    });

    test("should throw error when ticket count is zero", () => {
      expect(() => {
        service.purchaseTickets(1, new TicketTypeRequest("ADULT", 0));
      }).toThrow(InvalidPurchaseException);
    });
  });

 
  describe("Business Rules", () => {
    test("should throw error when ticket count exceeds 25", () => {
      expect(() => {
        service.purchaseTickets(1, new TicketTypeRequest("ADULT", 26));
      }).toThrow(InvalidPurchaseException);
    });

    test("should throw error when child tickets are purchased without adult", () => {
      expect(() => {
        service.purchaseTickets(1, new TicketTypeRequest("CHILD", 1));
      }).toThrow(InvalidPurchaseException);
    });

    test("should throw error when infants exceed adults", () => {
      expect(() => {
        service.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 1),
          new TicketTypeRequest("INFANT", 2)
        );
      }).toThrow(InvalidPurchaseException);
    });
  });

   describe("Valid Purchases & Calculations", () => {
    test("should process a valid purchase successfully", () => {
      expect(() => {
        service.purchaseTickets(
          1,
          new TicketTypeRequest("ADULT", 1),
          new TicketTypeRequest("INFANT", 1),
          new TicketTypeRequest("CHILD", 1)
        );
      }).not.toThrow();
    });

    test("should calculate correct amount and seats", () => {
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
        new TicketTypeRequest("INFANT", 1)
      );

      expect(paidAmount).toBe(40);
      expect(reservedSeats).toBe(2);
    });
  });
});