import inquirer from "inquirer";
console.log('HELLO');
inquirer.prompt([
    {
        type: 'input',
        name: 'hello',
        message: 'Hi, What\'s going on ??'
    }
]);
console.log('WOW,');
