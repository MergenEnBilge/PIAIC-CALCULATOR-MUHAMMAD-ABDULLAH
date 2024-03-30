class Parser {
    static operators: {[key: string]: (a: number, b: number) => number} = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => a**b
    };

    static precedence: {[key: string]: number} = {
        '+' : 1,
        '-' : 1,
        '*' : 2,
        '/' : 2,
        '^' : 3
    };

    static perfOperation(operator: string, operand1: number, operand2: number): number 
    {
        return this.operators[operator](operand1, operand2);
    }

    static isOperator(token: string): boolean
    {
        return token in this.operators
    }

    static solve(expression:string): number 
    {
        const tokens: string[] = expression.split(' ');
        const operatorStack: string[] = [];
        const numStack: number[] = [];
        for (const token of tokens)
        {
            if (!isNaN(parseFloat(token)))
            {
                numStack.push(parseFloat(token));
            }
            else if (this.isOperator(token))
            {
                while(operatorStack.length>0 && this.precedence[operatorStack[operatorStack.length-1]]>=this.precedence[token])
                {
                    const operator = operatorStack.pop()!;
                    const op2 = numStack.pop()!;
                    const op1 = numStack.pop()!;
                    numStack.push(this.perfOperation(operator, op1, op2));
                }
                operatorStack.push(token);
            }
            else if (token === '(') 
            {
                operatorStack.push(token);
            }
            else if (token === ')') 
            {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    const operator = operatorStack.pop()!;
                    const operand2 = numStack.pop()!;
                    const operand1 = numStack.pop()!;
                    numStack.push(this.perfOperation(operator, operand1, operand2));
                }
                operatorStack.pop();
            }
        }
        while (operatorStack.length > 0) {
            const operator = operatorStack.pop()!;
            const operand2 = numStack.pop()!;
            const operand1 = numStack.pop()!;
            numStack.push(this.perfOperation(operator, operand1, operand2));
        }
        return numStack.pop()!;
    }        
}

import inquirer from "inquirer";

let answers = await inquirer.prompt([
    {
        type: "string",
        name: "expression",
        message: "Enter your Expression: ",
    },
])
const result:number = Parser.solve(answers.expression);

console.log(`${answers.expression} = ${result}`);