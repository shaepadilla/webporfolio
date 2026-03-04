// index.js - reconstructed with fixed palette and working chart labels

document.addEventListener('DOMContentLoaded', function() {
  // register chartjs datalabels plugin
  if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
  }
  
  // ---------- state -------------
  let transactions = [];

  // UI elements
  const totalIncomeEl = document.getElementById('totalIncome');
  const totalExpenseEl = document.getElementById('totalExpense');
  const totalSavingsEl = document.getElementById('totalSavings');
  const balanceEl = document.getElementById('balance');
  const transactionListEl = document.getElementById('transactionList');
  const descInput = document.getElementById('descInput');
  const categorySelect = document.getElementById('categorySelect');
  const amountInput = document.getElementById('amountInput');
  const addBtn = document.getElementById('addTransactionBtn');
  const currencySelect = document.getElementById('currencySelect');
  
  // type toggle buttons
  const typeBtns = document.querySelectorAll('.type-btn');
  let currentType = 'income';

  // filter buttons
  const filterTabs = document.querySelectorAll('.filter-tab');
  let currentFilter = 'all';

  // chart instance
  let pieChart = null;

  // ---------- helper: get currency symbol ----------
  const getCurrencySymbol = () => {
    const selected = currencySelect.options[currencySelect.selectedIndex];
    return selected.getAttribute('data-symbol') || '$';
  };

  // ---------- format money with current currency symbol ----------
  const formatMoney = (value) => {
    return `${getCurrencySymbol()}${value.toFixed(2)}`;
  };

  // ---------- update summary (income, expense, savings, balance) ----------
  const updateSummary = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    const savings = transactions.filter(t => t.type === 'savings').reduce((acc, t) => acc + t.amount, 0);
    const balance = income - expense - savings;

    totalIncomeEl.textContent = formatMoney(income);
    totalExpenseEl.textContent = formatMoney(expense);
    totalSavingsEl.textContent = formatMoney(savings);
    balanceEl.textContent = formatMoney(balance);
  };

  // ---------- render pie chart with LABELS ----------
  const renderPieChart = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryMap = new Map();

    expenseTransactions.forEach(t => {
      const cat = t.category;
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + t.amount);
    });

    const categories = Array.from(categoryMap.keys());
    const amounts = Array.from(categoryMap.values());

    // If no expenses, show placeholder
    if (categories.length === 0) {
      categories.push('No expenses');
      amounts.push(1);
    }

    const ctx = document.getElementById('expensePieChart').getContext('2d');

    if (pieChart) {
      pieChart.destroy();
    }

    // palette-derived colors for pie
    const pieColors = ['#464CE0', '#978CC1', '#69BAA4', '#8f7fd0', '#5cb39f', '#7f71c5', '#4daa94', '#a195d6'];

    pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: amounts,
          backgroundColor: pieColors,
          borderWidth: 1,
          borderColor: '#F5ECFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { 
            callbacks: { 
              label: (ctx) => ` ${ctx.raw.toFixed(2)} ${getCurrencySymbol()}` 
            } 
          },
          datalabels: {
            display: true,
            color: '#F5ECFF',
            font: {
              weight: 'bold',
              size: 11
            },
            formatter: (value, context) => {
              const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              if (percentage > 5 || context.dataset.data.length === 1) {
                return context.chart.data.labels[context.dataIndex] + ' ' + percentage + '%';
              }
              return '';
            },
            backgroundColor: 'rgba(70, 76, 224, 0.7)',
            borderRadius: 12,
            padding: { top: 4, bottom: 4, left: 8, right: 8 },
            borderWidth: 1,
            borderColor: '#F5ECFF'
          }
        },
        layout: { padding: 8 }
      }
    });
  };

  // ---------- render transactions based on filter ----------
  const renderList = () => {
    const filtered = transactions.filter(t => {
      if (currentFilter === 'all') return true;
      return t.type === currentFilter;
    });

    if (filtered.length === 0) {
      transactionListEl.innerHTML = `<li class="empty-message">🧾 no transactions under "${currentFilter}"</li>`;
      return;
    }

    const sorted = [...filtered].reverse();

    let htmlString = '';
    sorted.forEach(t => {
      let amountClass = '';
      if (t.type === 'income') amountClass = 'income-amount';
      else if (t.type === 'expense') amountClass = 'expense-amount';
      else if (t.type === 'savings') amountClass = 'savings-amount';
      
      const sign = t.type === 'income' ? '+' : '-';
      const formattedAmount = `${sign}${getCurrencySymbol()}${t.amount.toFixed(2)}`;
      htmlString += `
        <li class="transaction-item" data-id="${t.id}">
          <div class="transaction-left">
            <span class="transaction-category">${t.category}</span>
            <span class="transaction-desc">${t.description}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;">
            <span class="transaction-amount ${amountClass}">${formattedAmount}</span>
            <button class="delete-btn" data-id="${t.id}" title="remove">✕</button>
          </div>
        </li>
      `;
    });

    transactionListEl.innerHTML = htmlString;

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        deleteTransaction(id);
      });
    });
  };

  // ---------- delete transaction ----------
  const deleteTransaction = (id) => {
    transactions = transactions.filter(t => t.id !== id);
    updateSummary();
    renderPieChart();
    renderList();
  };

  // ---------- add transaction ----------
  const addTransaction = () => {
    const description = descInput.value.trim();
    if (!description) {
      alert('please enter a description');
      return;
    }

    const amountVal = amountInput.value.trim();
    if (!amountVal) {
      alert('enter an amount');
      return;
    }
    const amount = parseFloat(amountVal);
    if (isNaN(amount) || amount <= 0) {
      alert('amount must be a positive number');
      return;
    }

    const category = categorySelect.value;
    const type = currentType; 

    const newTransaction = {
      id: Date.now() + Math.random().toString(36).substr(2, 4),
      description: description,
      category: category,
      amount: amount,
      type: type,
      timestamp: new Date().toISOString()
    };

    transactions.push(newTransaction);
    
    descInput.value = '';
    amountInput.value = '';
    descInput.focus();

    updateSummary();
    renderPieChart();
    renderList();
  };

  // ---------- set active type (income/expense/savings) ----------
  const setActiveType = (type) => {
    currentType = type;
    typeBtns.forEach(btn => {
      const btnType = btn.dataset.type;
      if (btnType === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  // ---------- set active filter ----------
  const setActiveFilter = (filter) => {
    currentFilter = filter;
    filterTabs.forEach(btn => {
      const btnFilter = btn.dataset.filter;
      if (btnFilter === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    renderList();
  };

  // ---------- refresh all displays when currency changes ----------
  const refreshCurrencyDisplay = () => {
    updateSummary();
    renderList();
    if (pieChart) {
      renderPieChart();
    }
  };

  // ---------- initialize event listeners ----------
  const init = () => {
    // type toggle
    typeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        setActiveType(type);
      });
    });

    
    filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        setActiveFilter(filter);
      });
    });

    
    addBtn.addEventListener('click', addTransaction);

   
    [descInput, amountInput].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          addTransaction();
        }
      });
    });

    
    currencySelect.addEventListener('change', refreshCurrencyDisplay);

    
    transactions = [
      { id: '1', description: 'Freelance project', category: 'Income', amount: 1250.00, type: 'income', timestamp: new Date('2025-03-10').toISOString() },
      { id: '2', description: 'Weekly groceries', category: 'Food', amount: 87.30, type: 'expense', timestamp: new Date('2025-03-12').toISOString() },
      { id: '3', description: 'Monthly savings transfer', category: 'Savings', amount: 300.00, type: 'savings', timestamp: new Date('2025-03-13').toISOString() },
      { id: '4', description: 'Gas / subway', category: 'Transport', amount: 45.00, type: 'expense', timestamp: new Date('2025-03-14').toISOString() },
      { id: '5', description: 'Salary March', category: 'Income', amount: 3200.00, type: 'income', timestamp: new Date('2025-03-15').toISOString() },
      { id: '6', description: 'Netflix', category: 'Entertainment', amount: 15.99, type: 'expense', timestamp: new Date('2025-03-17').toISOString() },
      { id: '7', description: 'Emergency fund', category: 'Savings', amount: 200.00, type: 'savings', timestamp: new Date('2025-03-18').toISOString() },
      { id: '8', description: 'New sneakers', category: 'Shopping', amount: 89.99, type: 'expense', timestamp: new Date('2025-03-18').toISOString() },
      { id: '9', description: 'Electric bill', category: 'Bills', amount: 112.40, type: 'expense', timestamp: new Date('2025-03-19').toISOString() },
    ];

    updateSummary();
    renderPieChart();
    renderList();
  };

  init();
});