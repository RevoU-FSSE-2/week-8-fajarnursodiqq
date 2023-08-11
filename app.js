class Transaction {
  constructor(amount, type, description) {
    this.amount = amount;
    this.type = type;
    this.description = description;
  }
}

class FinancialTracker {
  constructor() {
    this.transactions = [];
    this.balance = 0;
    this.loadTransactionsFromLocalStorage();
    this.updateBalance();
    this.updateTransactionList();
  }

  addTransaction(amount, type, description) {
    if (!amount || isNaN(amount)) {
      alert("Masukkan jumlah transaksi dengan benar.");
      return;
    }
    if (!description.trim()) {
      alert("Deskripsi transaksi tidak boleh kosong.");
      return;
    }
    const transaction = new Transaction(amount, type, description);
    this.transactions.push(transaction);
    this.balance += type === "income" ? amount : -amount;
    this.updateBalance();
    this.updateTransactionList();
    this.saveTransactionsToLocalStorage();
  }

  updateBalance() {
    const balanceAmount = document.getElementById("balanceAmount");
    if (balanceAmount) {
      balanceAmount.textContent = this.formatToRupiah(this.balance);
    }
    localStorage.setItem("balance", this.balance.toString());
  }

  formatToRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  }

  updateTransactionList() {
    const transactionList = document.getElementById("transactionList");
    const noTransactionMessage = document.getElementById(
      "noTransactionMessage"
    );

    transactionList.innerHTML =
      this.transactions.length === 0
        ? ""
        : this.transactions
            .map(
              (transaction) =>
                `<li class="list-group-item d-flex justify-content-between align-items-center">
                  ${
                    transaction.type === "income" ? "Pemasukan" : "Pengeluaran"
                  }: ${this.formatToRupiah(transaction.amount)} - ${
                  transaction.description
                }
              </li>`
            )
            .join("");

    if (noTransactionMessage) {
      noTransactionMessage.style.display =
        this.transactions.length === 0 ? "block" : "none";
    }
  }

  saveTransactionsToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  loadTransactionsFromLocalStorage() {
    const storedTransactions = localStorage.getItem("transactions");
    this.transactions = storedTransactions
      ? JSON.parse(storedTransactions)
      : [];
    this.balance = parseFloat(localStorage.getItem("balance")) || 0;
  }
}

const tracker = new FinancialTracker();

document.addEventListener("DOMContentLoaded", () => {
  const transactionForm = document.getElementById("transactionForm");
  if (transactionForm) {
    transactionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const amount = parseFloat(
        document.getElementById("transactionText").value.trim()
      );
      const type = document.getElementById("transactionType").value;
      const description = document
        .getElementById("transactionDescription")
        .value.trim();
      tracker.addTransaction(amount, type, description);
      document.getElementById("transactionText").value = "";
      document.getElementById("transactionDescription").value = "";
    });
  }

  const clearLocalStorageButton = document.getElementById(
    "clearLocalStorageButton"
  );
  if (clearLocalStorageButton) {
    clearLocalStorageButton.addEventListener("click", () => {
      const isConfirmed = window.confirm(
        "Apakah Anda yakin ingin menghapus semua data?"
      );
      if (isConfirmed) {
        tracker.transactions = [];
        tracker.balance = 0;
        tracker.updateBalance();
        tracker.updateTransactionList();
        tracker.saveTransactionsToLocalStorage();
      }
    });
  }
});
