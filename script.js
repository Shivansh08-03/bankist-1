"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (acc, sort = false) {
  // Clear the container before adding new movements
  containerMovements.innerHTML = "";

  // Create a sorted copy of movements if sorting is enabled
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // Render each movement
  movs.forEach(function (movement, i) {
    const type = movement > 0 ? "deposit" : "withdrawal";

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${type}
          </div>
          <div class="movements__value">${movement}€</div>
        </div>
      `;
    // Insert the new movement at the top of the container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Assuming account1.movements is an array of movements
// displayMovements(account1.movements);

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word[0];
      })
      .join("");
  });
};
createUsername(accounts);

const updateUI = function () {
  displayMovements(currentUser);
  displayCash(currentUser);
  displaySummary(currentUser);
};

const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits);

const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});

console.log(withdrawals);

const cash = movements.reduce(function (mov, i, arr, acc) {
  return mov + i;
}, 0);
console.log(cash);

const displayCash = function (acc) {
  acc.balance = acc.movements.reduce(function (mov, i) {
    return mov + i;
  }, 0);
  labelBalance.textContent = `${acc.balance} rupees`;
};

const maximum = movements.reduce(function (acc, mov) {
  if (mov > acc) {
    return mov;
  } else {
    return acc;
  }
});
const displaySummary = function (account) {
  console.log(account);

  const income = account.movements
    .filter((mov) => mov >= 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumIn.textContent = `${income}rs`;

  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => mov + acc, 0);
  labelSumOut.textContent = `${Math.abs(out)}rs`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}rs`;

  // Log the calculated values if needed
  console.log({ income, out: Math.abs(out), interest });
};

// displaySummary(account);
// console.log(displaySummary(account1.movements));

console.log(maximum);

const USDtorupees = 83.88;

const totalDeposit = movements
  .filter(function (mov) {
    return mov > 0;
  })
  .map(function (mov) {
    return mov * USDtorupees;
  })
  .reduce(function (acc, mov) {
    return mov + acc;
  });

console.log(totalDeposit);

const account = accounts.find(function (mov) {
  return mov.owner === "Jonas Schmedtmann";
});
console.log(account);
let currentUser;

// btnLogin.addEventListener(
//   "click",
//   function (w) {
//     w.preventDefault();
//     currentUser = accounts.find(function (acc) {
//       return acc.userName === inputCloseUsername.value;
//     });
//   },
//   console.log(currentUser)
// );
// btnLogin.addEventListener("click", function (event) {

btnLogin.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form from submitting

  // Find the current user based on the username
  currentUser = accounts.find(function (acc) {
    return acc.userName === inputLoginUsername.value;
  });

  // Check if the user was found and if the PIN matches
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Display the UI and welcome message
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(" ")[0]
    }`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    // Update the UI with the current user's data
    updateUI(currentUser);
  } else {
    // Handle incorrect login attempts (optional)
    console.log("Incorrect username or PIN");
  }
});

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault(); // Corrected to include parentheses

  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(function (acc) {
    return acc.userName === inputTransferTo.value;
  });
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    currentUser.balance >= amount &&
    transferTo?.userName !== currentUser.userName
  ) {
    console.log("valif");

    currentUser.movements.push(-amount);
    transferTo.movements.push(amount);

    updateUI(currentUser);
  }
});
btnLoan.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentUser.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    currentUser.movements.push(amount);
    updateUI();
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.userName &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.userName === currentUser.userName;
    });
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});

console.log(
  movements.some(function (mov) {
    return mov > 0;
  })
);

const arr = [1, 2, [2, 1], [1, 3], [2, 1]];
const newArr = [1, 3, [3, 2, [2]], 9];
console.log(newArr.flat(2));

const movementFlat = accounts
  .flatMap(function (mov) {
    return (mov = movements);
  })
  .reduce(function (acc, nov) {
    return acc + nov;
  });
console.log(movementFlat);

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  // Toggle sorting state and pass it to displayMovements
  displayMovements(currentUser, !sorted);
  // Flip the sorted state for next click
  sorted = !sorted;
});

const arrr = [1, 2, 3, 4, 5];
const x = new Array(7);

console.log(x);
x.fill(2, 3, 7);

const y = Array.from({ length: 9 }, function (_, i) {
  return i + 1;
});
console.log(y);

const diceRoll = Array.from({ length: 100 }, function (_, i) {
  return Math.trunc(Math.random() * 6) + 1;
});
