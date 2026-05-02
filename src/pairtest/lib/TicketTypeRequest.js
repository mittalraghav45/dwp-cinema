/**
 * Immutable Object.
 */

const VALID_TYPES = ['ADULT', 'CHILD', 'INFANT'];
export default class TicketTypeRequest {
  #type;
  #noOfTickets;

  constructor(type, noOfTickets) {
    if (!VALID_TYPES.includes(type)) {
      throw new TypeError(`type must be ${this.VALID_TYPES.slice(0, -1).join(', ')}, or ${this.VALID_TYPES.slice(-1)}`);
    }

 if (!Number.isInteger(noOfTickets)) {
  throw new TypeError('noOfTickets must be a positive integer');
}

    this.#type = type;
    this.#noOfTickets = noOfTickets;

    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }

  
}
