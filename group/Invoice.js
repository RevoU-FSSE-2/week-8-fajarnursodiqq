export class Invoice {
  constructor(client, details, amount) {
    this.client = client;
    this.details = details;
    this.amount = amount;
  }
  format() {
    return `Aku mencatatkan keuangan ${this.client} sebesar ${this.amount} untuk ${this.details}`;
  }
}
