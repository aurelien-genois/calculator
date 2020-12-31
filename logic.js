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
            // prevent NaN if O/O
            if(a == 0 && b == 0) {
                return 0;
            }
            return divide(a,b);
    }
}

function addDigit(e) {
    // if prec input was =, clear displayText
    if(precInput === '=') {
        displayText.textContent = '';
        numbers = [];
    }   
    const digit = e.target.attributes.getNamedItem('data-number').value; // get the digit
    displayText.textContent += digit; // display the digit
    currentDigits.push(digit); // store the digit
    precInput = digit; // update prec input
    // if there is already a dot, disable the dot button
    (currentDigits.indexOf(".") != -1) ? dotButton.disabled = true : dotButton.disabled = false;

}

function addOperator(e) {
    // if prec input is a operator for pervent two successive operators
    switch(precInput) {
        case "/":
        case "*":
        case "-":
        case "+":
            console.log("Two operators in a row");
            return;
        case "init":
        case "clear":
            console.log("no digit before");
            return;
    }
    const number = Number(currentDigits.join('')); // join the current digits as a number (operand)
    currentDigits = []; // clear the current digits
    const operator = e.target.attributes.getNamedItem('data-function').value; // get the operator
    if((precInput !== '=')) {
        numbers.push(number); // store the number (operand) if the prec input is not =, because the last numbers element is still the precedent result alone
    }
    operators.push(operator); // store the operator
    displayText.textContent += ' ' + operator + ' '; // display the operator
    precInput = operator; // update prec input
    // if there is already a dot, disable the dot button
    (currentDigits.indexOf(".") != -1) ? dotButton.disabled = true : dotButton.disabled = false;

}

function calcResult(e) {
        const number = Number(currentDigits.join('')); // join the current digits as a number (operand)
        currentDigits = []; // clear the current digits
        numbers.push(number); // store the number (operand) 
        result = numbers[0]; // set the result to the last numbers (useful if their is no operator but new digits)
        // loop for the operators * and / which must be prior
        for (let i = 0; i < operators.length;i++) {
            if ((operators[i] === "*") || (operators[i] === "/")) {
                result = operate(operators[i], numbers[i], numbers[i+1]); // first and second number are i and i+1 (from left to right)
                // if divide by 0 (Infinity), result is 0
                if (result === Infinity) {
                    result = 0;
                }
                numbers.splice(i,2,result); // replace the two operands with the result of their operation
                operators.splice(i,1);
            }
        }
        // loop for other + and - operators
        for (let i = 0; i < operators.length;i++) {          
            result = operate(operators[i],numbers[0], numbers[1]); // first and second number are 0 and 1 (from left to right)
            // if divide by 0 (Infinity), result is 0
            if (result === Infinity) {
                result = 0;
            }
            numbers.splice(0,2,result); // replace the two operands with the result of their operation
        }
        precText.textContent = displayText.textContent; // copy the display text to the precedent text
        displayText.textContent = +result.toFixed(13); // display the result
        operators = []; // clear the operators
        precInput = e.target.attributes.getNamedItem('data-function').value; // update prec input
        // if there is already a dot, disable the dot button
        (currentDigits.indexOf(".") != -1) ? dotButton.disabled = true : dotButton.disabled = false;
}

function clear(e) {
    numbers = []; // clear the numbers
    operators = []; // clear the operators
    currentDigits = []; // clear the currentDigits
    displayText.textContent = ''; // clear the display
    precText.textContent = ''; // clear the precedent text
    precInput = e.target.attributes.getNamedItem('data-function').value; // update prec input
}

function back(e) {
    switch(precInput) {
        case "/":
        case "*":
        case "-":
        case "+":
            operators.pop(); // remove the last operator from operators
            displayText.textContent = displayText.textContent.split('').slice(0,-3).join(''); // remove the last operator from the display
            currentDigits.push(numbers.slice(-1)[0]); // move back the last number to the currentDigits
            numbers.pop(); // remove the last number
            break;
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
        case ".":
            currentDigits.pop(); // remove the last digit from currentDigits
            displayText.textContent = displayText.textContent.split('').slice(0,-1).join(''); // remove the last digit from the display
            break;
    }    
    // if there is already a dot, disable the dot button, or re-enable if dot is removed
    (currentDigits.indexOf(".") != -1) ? dotButton.disabled = true : dotButton.disabled = false;
    //precInput = e.target.attributes.getNamedItem('data-function').value; // update prec input
}

// get the inputs
const digitsButtons = document.querySelectorAll('.numberInput');
const operatorsButtons = document.querySelectorAll('.operator');
const calcButton = document.querySelector('.functionInput[data-function="="]');
const clearButton = document.querySelector('.functionInput[data-function="clear"]');
const backButton = document.querySelector('.functionInput[data-function="back"]');
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
digitsButtons.forEach(input => input.addEventListener('click', addDigit));
operatorsButtons.forEach(input => input.addEventListener('click', addOperator));
calcButton.addEventListener('click', calcResult);
clearButton.addEventListener('click', clear);
backButton.addEventListener('click', back);
