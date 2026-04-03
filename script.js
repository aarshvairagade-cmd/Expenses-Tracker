const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
// if any previous transactions are there then show other wise empty array

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();  // stop page reload 

  const description = descriptionEl.value.trim(); // in text
  const amount = parseFloat(amountEl.value); // convert in number

  if (description === "" || isNaN(amount)) return; // if input is wrong do nothing

  transactions.push({
    id: Date.now(),
    description,
    amount
  });  // add new transaction in it

  localStorage.setItem("transactions", JSON.stringify(transactions)); // save in storage

  updateTransactionList();  // list refresh
  updateSummary(); // 

  transactionFormEl.reset();  // form empty reset all field
}

function updateTransactionList() {
  transactionListEl.innerHTML = ""; // to remove old data and show fresh data

  const sortedTransactions = [...transactions].reverse(); // spread operator it make copy of original array
   // reverse show latest transaction first 
   // in every transaction loop will run 
  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction); // this will create html li list
    transactionListEl.appendChild(transactionEl); // element had made shown in list
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li"); // this will create a list item
  li.classList.add("transaction"); // given commom class to every item 
  li.classList.add(transaction.amount > 0 ? "income" : "expense"); // give income expenses

  li.innerHTML = `
    <span>${transaction.description}</span> 
    <span>   
      ${formatCurrency(transaction.amount)} 
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
    </span>
  `;

  return li;   // show innner text //  format amount // remove transaction call will remove transaction
}

function updateSummary() {
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  //  reduce method to find total of hole error 
  const income = transactions
    .filter(t => t.amount > 0) // shows only positive one income
    .reduce((acc, t) => acc + t.amount, 0); // gives you total

  const expenses = transactions 
    .filter(t => t.amount < 0) // shows only negative one expenses
    .reduce((acc, t) => acc + t.amount, 0); // gives you total

  balanceEl.textContent = formatCurrency(balance); // shows balance on screen
  incomeAmountEl.textContent = formatCurrency(income); // shows income on screen
  expenseAmountEl.textContent = formatCurrency(expenses);  // shows expenses on screen
  
}
 // above function converting number in rupee
function formatCurrency(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format(number);
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id); // which transaction id will match just remove from list

  localStorage.setItem("transactions", JSON.stringify(transactions));
  // localstorage means browser memory  converting array in string
  updateTransactionList();  // again transaction list will update
  updateSummary(); // again all things will calculate again 
}

// initial render or page is reload the above will run automatically 
updateSummary(); 
updateTransactionList();