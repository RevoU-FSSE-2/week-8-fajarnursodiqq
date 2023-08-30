export class Payment {
  constructor(recipient, details, amount) {
    this.recipient = recipient;
    this.details = details;
    this.amount = amount;
  }
  format() {
    return `Aku mencatatkan keuangan ${this.recipient} sebesar ${this.amount} untuk ${this.details}`;
  }
}
