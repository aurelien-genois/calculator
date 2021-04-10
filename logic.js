function add(...a) {
  return a.reduce((result, number) => result + number);
}
function substract(...a) {
  return a.reduce((result, number) => result - number);
}
function multiply(...a) {
  return a.reduce((result, number) => result * number);
}
function divide(...a) {
  return a.reduce((result, number) => result / number);
}

function operate(operator, a, b) {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return substract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      // prevent NaN if O/O or -x/0
      if (a <= 0 && b == 0) {
        return 0;
      }
      return divide(a, b);
  }
}

function addDigit() {
  // if prec input was =, clear displayText
  if (displayText.textContent.length >= 24) {
    console.log('To much characters!' + displayText.textContent.length);
    return;
  }
  if (precInput === '=') {
    displayText.textContent = '';
    numbers = [];
  }
  const digit = this.dataset.number; // get the digit
  let zeroBeforeDot = '';
  if (digit == '.') {
    // if no currentDigits, add a 0 before the .
    if (currentDigits.length == 0) {
      currentDigits.unshift(0);
      zeroBeforeDot = 0; // 0 before . for display if no currentDigits
    }
    // if there is already a dot, do not add it to the digits
    if (currentDigits.indexOf('.') != -1) {
      console.log('Already a dot in the current number');
      return;
    }
  }
  displayText.textContent += zeroBeforeDot + digit; // display the digit
  currentDigits.push(digit); // store the digit
  precInput = digit; // update prec input
}

function addOperator() {
  // if prec input is a operator for pervent two successive operators
  switch (precInput) {
    case '/':
    case '*':
    case '-':
    case '+':
      console.log('Two operators in a row');
      return;
    case 'init':
    case 'clear':
      console.log('no digit before');
      return;
  }
  if (displayText.textContent.length >= 24) {
    console.log('To much characters!' + displayText.textContent.length);
    return;
  }
  // if there is only a -, add a 0 for avoid a NaN
  if (currentDigits.length == 1 && currentDigits[0] == '-') {
    currentDigits.push(0);
  }
  const number = Number(currentDigits.join('')); // join the current digits as a number (operand)
  currentDigits = []; // clear the current digits
  const operator = this.dataset.function; // get the operator
  if (precInput !== '=') {
    numbers.push(number); // store the number (operand) if the prec input is not =, because the last numbers element is still the precedent result alone
  }
  operators.push(operator); // store the operator
  displayText.textContent += ' ' + operator + ' '; // display the operator
  precInput = operator; // update prec input
}

function calcResult() {
  // prevent displaying the last operator if no digits after him
  switch (precInput) {
    case '/':
    case '*':
    case '-':
    case '+':
      displayText.textContent = displayText.textContent
        .split('')
        .slice(0, -3)
        .join(''); // remove the last operator from the display
      console.log(operators);
  }
  // if there is only a -, add a 0 for avoid a NaN
  if (currentDigits.length == 1 && currentDigits[0] == '-') {
    currentDigits.push(0);
  }
  const number = Number(currentDigits.join('')); // join the current digits as a number (operand)
  currentDigits = []; // clear the current digits
  numbers.push(number); // store the number (operand)
  result = numbers[0]; // set the result to the last numbers (useful if their is no operator but new digits)
  // loop for the operators * and / which must be prior
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '*' || operators[i] === '/') {
      result = operate(operators[i], numbers[i], numbers[i + 1]); // first and second number are i and i+1 (from left to right)
      // if divide by 0 (Infinity), result is 0
      if (result === Infinity) {
        result = 0;
      }
      numbers.splice(i, 2, result); // replace the two operands with the result of their operation
      operators.splice(i, 1);
    }
  }
  // loop for other + and - operators
  for (let i = 0; i < operators.length; i++) {
    result = operate(operators[i], numbers[0], numbers[1]); // first and second number are 0 and 1 (from left to right)
    numbers.splice(0, 2, result); // replace the two operands with the result of their operation
  }
  precText.textContent = displayText.textContent; // copy the display text to the precedent text
  displayText.textContent = +result.toFixed(13); // round and display the result
  operators = []; // clear the operators
  precInput = this.dataset.function; // update prec input
}

function clear() {
  numbers = []; // clear the numbers
  operators = []; // clear the operators
  currentDigits = []; // clear the currentDigits
  result = 0;
  displayText.textContent = ''; // clear the display
  precText.textContent = ''; // clear the precedent text
  precInput = this.dataset.function; // update prec input
}

function back() {
  switch (precInput) {
    case '/':
    case '*':
    case '-':
    case '+':
      operators.pop(); // remove the last operator from operators
      displayText.textContent = displayText.textContent
        .split('')
        .slice(0, -3)
        .join(''); // remove the last operator from the display
      currentDigits.push(numbers.slice(-1)[0]); // move back the last number to the currentDigits
      numbers.pop(); // remove the last number
      precInput = 'back'; // to prevent "two operators in a row" error if add again a new operator
      break;
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
    case '.':
    case '+/-':
      currentDigits.pop(); // remove the last digit from currentDigits
      displayText.textContent = displayText.textContent
        .split('')
        .slice(0, -1)
        .join(''); // remove the last digit from the display
      break;
  }
}

function changeSign() {
  switch (precInput) {
    case '/':
    case '*':
    case '-':
    case '+':
    case '+/-':
    case 'clear':
    case 'init':
      // push - sign to currentDigits no [-] already
      if (currentDigits[0] != '-') {
        currentDigits.push('-');
        displayText.textContent += '-'; // display the sign
      } else {
        currentDigits.pop(); // remove the sign if [-] already
        displayText.textContent = displayText.textContent
          .split('')
          .slice(0, -1)
          .join(''); // display the sign from the display
      }
      precInput = '+/-'; // update prec input
      return;
  }
  // if no currentDigits add - sign to the result and numbers[0] if not already and update displayText
  if (currentDigits.length == 0) {
    result = result > 0 ? -result : Math.abs(result);
    numbers[0] = result;
    displayText.textContent = result;
  } else {
    // unshift - sign to currentDigits if currentDigits[0] is not [-]
    currentDigits[0] != '-'
      ? currentDigits.unshift('-')
      : currentDigits.shift();
    let currentDigitsLength =
      currentDigits[0] != '-'
        ? currentDigits.length + 1
        : currentDigits.length - 1;
    displayText.textContent = displayText.textContent
      .split('')
      .slice(0, -currentDigitsLength)
      .join(''); // remove the last digits from displayText
    displayText.textContent += currentDigits.join('');
  }
}

// get the inputs
const digitsButtons = document.querySelectorAll('.numberInput');
const operatorsButtons = document.querySelectorAll('.operator');
const calcButton = document.querySelector('.functionInput[data-function="="]');
const clearButton = document.querySelector(
  '.functionInput[data-function="clear"]'
);
const backButton = document.querySelector(
  '.functionInput[data-function="back"]'
);
const signButton = document.querySelector(
  '.functionInput[data-function="+/-"]'
);
const dotButton = document.querySelector('.numberInput[data-number="."]');
// get the texts display
const displayText = document.querySelector('#displayText');
const precText = document.querySelector('#precText');
// init the arrays and variables
let currentDigits = [];
let numbers = [];
let operators = [];
let result = 0;
let precInput = 'init';

// add event listeners for each inputs
digitsButtons.forEach((input) => input.addEventListener('click', addDigit));
operatorsButtons.forEach((input) =>
  input.addEventListener('click', addOperator)
);
calcButton.addEventListener('click', calcResult);
clearButton.addEventListener('click', clear);
backButton.addEventListener('click', back);
signButton.addEventListener('click', changeSign);

// link keyboard keys to buttons (adapted from other students solution)
window.onkeydown = function (e) {
  let x = e.key;
  let choice;
  switch (x) {
    case '1':
      choice = document.querySelector('#one');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '2':
      choice = document.querySelector('#two');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '3':
      choice = document.querySelector('#three');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '4':
      choice = document.querySelector('#four');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '5':
      choice = document.querySelector('#five');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '6':
      choice = document.querySelector('#six');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '7':
      choice = document.querySelector('#seven');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '8':
      choice = document.querySelector('#eight');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '9':
      choice = document.querySelector('#nine');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '0':
      choice = document.querySelector('#zero');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case 'Escape':
      choice = document.querySelector('#clear');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case 'Backspace':
      choice = document.querySelector('#backspace');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '/':
      choice = document.querySelector('#divide');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '*':
      choice = document.querySelector('#multiply');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '-':
      choice = document.querySelector('#substract');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '+':
      choice = document.querySelector('#add');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case '.':
      choice = document.querySelector('#decimal');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case 'Enter':
      choice = document.querySelector('#enter');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
    case 'Shift':
      choice = document.querySelector('#plus-minus');
      choice.click();
      choice.classList.add('active');
      setTimeout(() => {
        choice.classList.remove('active');
      }, 0200);
      break;
  }
};
