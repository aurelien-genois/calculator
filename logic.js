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

function calcResult(e) {
        const number = Number(digitsInput.join(''));
        digitsInput = [];
        numbers.push(number);
        Result = numbers[0];
        // loop for the * and / which must be prior
        for (let i = 0; i < operators.length;i++) {
            if ((operators[i] === "*") || (operators[i] === "/")) {
                Result = operate(operators[i], numbers[i], numbers[i+1]);
                numbers.splice(i,2,Result);
                operators.splice(i,1);
            }
        }
        // loop for other + and - operators
        for (let i = 0; i < operators.length;i++) {          
            //first and second number are always 0 and 1
            Result = operate(operators[i],numbers[0], numbers[1]);
            numbers.splice(0,2,Result);
        }
        precText.textContent = displayText.textContent;
        displayText.textContent = Result;
        operators = [];
        precInput = e.target.attributes.getNamedItem('data-function').value;
}

function clear(e) {
    numbers = [];
    operators = [];
    displayText.textContent = '';
    precText.textContent = '';
    precInput = e.target.attributes.getNamedItem('data-function').value;
}

function back(e) {
    switch(precInput) {
        case "/":
        case "*":
        case "-":
        case "+":
            operators.pop();
            displayText.textContent = displayText.textContent.split('').slice(0,-3).join('');
            precInput = 'backOperand';
            return;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            digitsInput.pop();
            displayText.textContent = displayText.textContent.split('').slice(0,-1).join('');
            precInput = e.target.attributes.getNamedItem('data-function').value;
            return;
    }
    
}

function addOperator(e) {
    const number = Number(digitsInput.join(''));
    digitsInput = [];
    const operator = e.target.attributes.getNamedItem('data-function').value;
    // pervent two successive operators, before push any number or operator
    switch(precInput) {
        case "/":
        case "*":
        case "-":
        case "+":
            console.log("Two operators in a row");
            return;
    }
    if((precInput !== '=') && (precInput !== 'backOperand')) {
        numbers.push(number);
    }
    operators.push(operator);
    displayText.textContent += ' ' + operator + ' ';
    precInput = operator;
}

const digitsButtons = document.querySelectorAll('.numberInput');

const operatorsButtons = document.querySelectorAll('.operator');
const calcButton = document.querySelector('.functionInput[data-function="="]');
const clearButton = document.querySelector('.functionInput[data-function="clear"]');
const backButton = document.querySelector('.functionInput[data-function="back"]');

const displayText = document.querySelector('#displayText');
const precText = document.querySelector('#precText');
let digitsInput = [];
let numbers = [];
let operators = [];
let Result = 0;
let precInput = '';

digitsButtons.forEach(input => input.addEventListener('click', displayNumber));

operatorsButtons.forEach(input => input.addEventListener('click', addOperator));
calcButton.addEventListener('click', calcResult);
clearButton.addEventListener('click', clear);
backButton.addEventListener('click', back);

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
