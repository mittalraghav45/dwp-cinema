import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";

const PRICES = {
  INFANT: 0,
  CHILD: 15,
  ADULT: 25,
};

const VALID_TYPES = ["ADULT", "CHILD", "INFANT"];

export default class TicketService {
  constructor() {
    this.paymentService = new TicketPaymentService();
    this.seatReservationService = new SeatReservationService();
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID");
    }

    if (ticketTypeRequests.length === 0) {
      throw new InvalidPurchaseException("No tickets requested");
    }

    let totalTickets = 0;
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;

    for (const request of ticketTypeRequests) {
      if (
        !request ||
        typeof request.getTicketType !== "function" ||
        typeof request.getNoOfTickets !== "function"
      ) {
        throw new InvalidPurchaseException("Invalid ticket request");
      }

      const type = request.getTicketType();
      const count = request.getNoOfTickets();

      if (!Number.isInteger(count) || count <= 0) {
        throw new InvalidPurchaseException(
          "Ticket count must be greater than 0",
        );
      }

      if (!VALID_TYPES.includes(type)) {
        throw new InvalidPurchaseException("Invalid ticket type");
      }

      totalTickets += count;

      if (type === "ADULT") adultCount += count;
      else if (type === "CHILD") childCount += count;
      else infantCount += count;
    }

    if (totalTickets > 25) {
      throw new InvalidPurchaseException(
        "Cannot purchase more than 25 tickets",
      );
    }

    if (adultCount === 0 && childCount + infantCount > 0) {
      throw new InvalidPurchaseException(
        "Child and Infant tickets require at least one Adult",
      );
    }
    if (infantCount > adultCount) {
      throw new InvalidPurchaseException(
        "Each infant must be accompanied by one adult",
      );
    }

    const totalAmount =
      adultCount * PRICES.ADULT +
      childCount * PRICES.CHILD +
      infantCount * PRICES.INFANT;

    const totalSeats = adultCount + childCount;

    this.paymentService.makePayment(accountId, totalAmount);
    this.seatReservationService.reserveSeat(accountId, totalSeats);
  }
}
