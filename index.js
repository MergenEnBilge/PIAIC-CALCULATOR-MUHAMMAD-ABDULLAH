class Parser {
    static operators = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => a ** b
    };
    static precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3
    };
    static perfOperation(operator, operand1, operand2) {
        return this.operators[operator](operand1, operand2);
    }
    static isOperator(token) {
        return token in this.operators;
    }
    static solve(expression) {
        const tokens = expression.split(' ');
        const operatorStack = [];
        const numStack = [];
        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                numStack.push(parseFloat(token));
            }
            else if (this.isOperator(token)) {
                while (operatorStack.length > 0 && this.precedence[operatorStack[operatorStack.length - 1]] >= this.precedence[token]) {
                    const operator = operatorStack.pop();
                    const op2 = numStack.pop();
                    const op1 = numStack.pop();
                    numStack.push(this.perfOperation(operator, op1, op2));
                }
                operatorStack.push(token);
            }
            else if (token === '(') {
                operatorStack.push(token);
            }
            else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    const operator = operatorStack.pop();
                    const operand2 = numStack.pop();
                    const operand1 = numStack.pop();
                    numStack.push(this.perfOperation(operator, operand1, operand2));
                }
                operatorStack.pop();
            }
        }
        while (operatorStack.length > 0) {
            const operator = operatorStack.pop();
            const operand2 = numStack.pop();
            const operand1 = numStack.pop();
            numStack.push(this.perfOperation(operator, operand1, operand2));
        }
        return numStack.pop();
    }
}
import inquirer from "inquirer";
let answers = await inquirer.prompt([
    {
        type: "string",
        name: "expression",
        message: "Enter your Expression: ",
    },
]);
const result = Parser.solve(answers.expression);
console.log(`${answers.expression} = ${result}`);
