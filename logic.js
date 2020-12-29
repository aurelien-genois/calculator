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

function operate(operator,a,b) {
    switch (operator) {
        case "+":
            return add(a,b);
        case "-":
            return substract(a,b);
        case "*":
            return multiply(a,b);
        case "/":
            return divide(a,b);
    }
}
// need to have "" around the operator (or a string) : operate("+",3,4)

function displayNumber(e) {
    // if prec input was =, clear displayText
    if(precInput === '=') {
        displayText.textContent = '';
        numbers = [];
    }
    const digit = e.target.attributes.getNamedItem('data-number').value;
    displayText.textContent += digit;
    digitsInput.push(digit);
    precInput = e.target.attributes.getNamedItem('data-number').value;
}

function addFunction(e) {
    const number = Number(digitsInput.join(''));
    digitsInput = [];
        // if prec input was =, do not push number
    if(precInput !== '=') {
        numbers.push(number);
    }
    const operator = e.target.attributes.getNamedItem('data-function').value;
    operators.push(operator);
    if (operator === "=") {
        for (let i = 0; i < operators.length - 1;i++) {          
            // ! the * and / must be prior (from left to right)
            //first and second number are always 0 and 1
            stepResult = operate(operators[i],numbers[0], numbers[1]);
            // the two first number must be removed
            numbers.shift();
            numbers.shift();
            // operate became the first number
            numbers.unshift(stepResult);
        }
        precText.textContent = displayText.textContent;
        displayText.textContent = stepResult;
        operators = [];
    } else if (operator === "clear") {
        numbers = [];
        operators = [];
        displayText.textContent = '';
        precText.textContent = '';
    } else {
        displayText.textContent += ' ' + operator + ' ';
    }
    precInput = e.target.attributes.getNamedItem('data-function').value;
}

const digitsButtons = document.querySelectorAll('.numberInput');
const functionButtons = document.querySelectorAll('.functionInput');
const displayText = document.querySelector('#displayText');
const precText = document.querySelector('#precText');
let digitsInput = [];
let numbers = [];
let operators = [];
let stepResult = 0;
let precInput = '';

digitsButtons.forEach(input => input.addEventListener('click', displayNumber));

functionButtons.forEach(input => input.addEventListener('click', addFunction));

// ! add a back button (remove last digit)

/* 
logic
click several digit
display the digits
store the digits in a array
when click a operator (data-function)
    join the digits to create a number
    clean the digits array
    store the number into an array
    get the operator
    store the operator into an array
    if the operator is =
        operate for each operator (until finish)
        copy the displayText
        add the displayText in the precText
        clear the displayText
        display the result in the displayText
    else
    display the operator
click several digit...


*/
