var Transaction = /** @class */ (function () {
    function Transaction(amount, type, description) {
        this.amount = amount;
        this.type = type;
        this.description = description;
    }
    return Transaction;
}());
var FinancialTracker = /** @class */ (function () {
    function FinancialTracker() {
        this.transactions = [];
        this.balance = 0;
        this.loadTransactionsFromLocalStorage();
        this.updateBalance();
        this.updateTransactionList();
    }
    FinancialTracker.prototype.addTransaction = function (amount, type, description) {
        if (!amount || isNaN(amount)) {
            alert("Masukkan jumlah transaksi dengan benar.");
            return;
        }
        if (!description.trim()) {
            alert("Deskripsi transaksi tidak boleh kosong.");
            return;
        }
        var transaction = new Transaction(amount, type, description);
        this.transactions.push(transaction);
        this.balance += type === "income" ? amount : -amount;
        this.updateBalance();
        this.updateTransactionList();
        this.saveTransactionsToLocalStorage();
    };
    FinancialTracker.prototype.updateBalance = function () {
        var balanceAmount = document.getElementById("balanceAmount");
        if (balanceAmount) {
            balanceAmount.textContent = this.formatToRupiah(this.balance);
        }
        localStorage.setItem("balance", this.balance.toString());
    };
    FinancialTracker.prototype.formatToRupiah = function (amount) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };
    FinancialTracker.prototype.updateTransactionList = function () {
        var _this = this;
        var transactionList = document.getElementById("transactionList");
        var noTransactionMessage = document.getElementById("noTransactionMessage");
        transactionList.innerHTML =
            this.transactions.length === 0
                ? ""
                : this.transactions
                    .map(function (transaction) {
                    return "<li class=\"list-group-item d-flex justify-content-between align-items-center\">\n                    ".concat(transaction.type === "income"
                        ? "Pemasukan"
                        : "Pengeluaran", ": ").concat(_this.formatToRupiah(transaction.amount), " - ").concat(transaction.description, "\n                </li>");
                })
                    .join("");
        if (noTransactionMessage) {
            noTransactionMessage.style.display =
                this.transactions.length === 0 ? "block" : "none";
        }
    };
    FinancialTracker.prototype.saveTransactionsToLocalStorage = function () {
        localStorage.setItem("transactions", JSON.stringify(this.transactions));
    };
    FinancialTracker.prototype.loadTransactionsFromLocalStorage = function () {
        var storedTransactions = localStorage.getItem("transactions");
        this.transactions = storedTransactions
            ? JSON.parse(storedTransactions)
            : [];
        this.balance = parseFloat(localStorage.getItem("balance")) || 0;
    };
    return FinancialTracker;
}());
var tracker = new FinancialTracker();
document.addEventListener("DOMContentLoaded", function () {
    var transactionForm = document.getElementById("transactionForm");
    if (transactionForm) {
        transactionForm.addEventListener("submit", function (event) {
            event.preventDefault();
            var amount = parseFloat(document.getElementById("transactionText").value.trim());
            var type = document.getElementById("transactionType").value;
            var description = document.getElementById("transactionDescription").value.trim();
            tracker.addTransaction(amount, type, description);
            document.getElementById("transactionText").value =
                "";
            document.getElementById("transactionDescription").value = "";
        });
    }
    var clearLocalStorageButton = document.getElementById("clearLocalStorageButton");
    if (clearLocalStorageButton) {
        clearLocalStorageButton.addEventListener("click", function () {
            var isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus semua data?");
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
