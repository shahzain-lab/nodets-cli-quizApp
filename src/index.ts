import inquirer from "inquirer"
import { IQuestionsTypes } from "./IQuestions.js";
import { Model } from "./Model.js";

console.log('HELLO')

// https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple

inquirer.prompt([
    {
        type: 'input',
        name: 'hello',
        message: 'Hi, What\'s going on ??'
    }
])

console.log('WOW,');

class App {

    constructor( private model: Model ) {}

   async init(): Promise<void> {
       const types = await this.gameInterval();
       this.model.getUserTypes(types);
    } 

    async gameInterval(): Promise<IQuestionsTypes> {
        const promptQuestions = await inquirer.prompt([
            {
                type: 'input',
                name: 'numbers',
                message: 'Number of questions you want to answer: ',
                default: 10
            }
        ])
        const promptLevel = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'level',
                message: 'Select difficulty level: ',
                choices: [
                    'easy',
                    'medium',
                    'hard'
                ]
            }
        ])
        return {
            questions: await promptQuestions,
            level: await promptLevel
        }
    }
};

const app = new App(new Model);
app.init()