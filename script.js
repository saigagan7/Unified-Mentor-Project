document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!date || !description || !category || isNaN(amount)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const transaction = {
        date,
        description,
        category,
        amount
    };

    addTransactionToList(transaction);
    updateSummary();
    saveToLocalStorage();
    document.getElementById('transaction-form').reset();
});

function addTransactionToList(transaction) {
    const transactionList = document.getElementById('transaction-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `${transaction.date} - ${transaction.description} (${transaction.category}): $${transaction.amount.toFixed(2)} <button onclick="deleteTransaction(this)">Delete</button>`;
    transactionList.appendChild(listItem);
}

function deleteTransaction(button) {
 const listItem = button.parentElement;
    listItem.remove();
    updateSummary();
    saveToLocalStorage();
}

function updateSummary() {
    const transactionList = document.getElementById('transaction-list');
    const transactions = transactionList.getElementsByTagName('li');
    let totalIncome = 0;
    let totalExpenses = 0;

    for (let transaction of transactions) {
        const amount = parseFloat(transaction.innerText.split(': $')[1]);
        const category = transaction.innerText.split('(')[1].split(')')[0];

        if (category === 'Income') {
            totalIncome += amount;
        } else {
            totalExpenses += amount;
        }
    }

    document.getElementById('total-income').innerText = totalIncome.toFixed(2);
    document.getElementById('total-expenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('net-income').innerText = (totalIncome - totalExpenses).toFixed(2);
}

function saveToLocalStorage() {
    const transactions = [];
    const transactionList = document.getElementById('transaction-list');
    const items = transactionList.getElementsByTagName('li');

    for (let item of items) {
        const [date, description, category, amount] = item.innerText.split(' - ')[0].split(' - ').concat(item.innerText.split(': $'));
        transactions.push({ date, description, category: category.split('(')[1].split(')')[0], amount: parseFloat(amount) });
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadFromLocalStorage() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(transaction => {
        addTransactionToList(transaction);
    });
    updateSummary();
}

window.onload = loadFromLocalStorage;