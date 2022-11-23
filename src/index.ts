import chalk from "chalk";
import inquirer from "inquirer"
import { IQuestion, IQuestionsResults, IQuestionsTypes } from "./IQuestions.js";
import { Model } from "./Model.js";


// https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple

class App {
    data: IQuestion[] | [] = []

    constructor( private model: Model ) {}

   async init(): Promise<void> {
       let corrects = []
       let incorrects = []
       const types = await this.gameInterval();
       const res = await this.model.getUserTypes(types);
       if(res && typeof res !== 'string') {
           const data = res.results;
           const questions = this.filterData(data);
           this.data = questions;

           for(let i = 0; i < questions.length; i++) {
               const ans = await this.promptQuestions(questions[i]);
               if(questions[i].correct === ans) {
                   corrects.push(ans)
               } else {
                   incorrects.push(ans)
               };
           }
           console.log(`
           ${chalk.bgGreen(`Your ${corrects.length} questions are corrects and ${incorrects.length} questions are incorrects.`)}\n
           ${chalk.green.bold('Correct Answers')}
           ${corrects.map((c, i) => 
            `\n${chalk.blue(i+1)}: ${chalk.magenta(c)}`
            )}
           `)

           console.log(`
           ${chalk.yellow.bold('Incorrect Answers')}
           ${incorrects.map((c, i) => 
            `\n${chalk.blue(i+1)}: ${chalk.red(c)}`
            )}
           `)
           this.playConfirmation()
       }
    } 

    async gameInterval(): Promise<IQuestionsTypes> {
        let amount
        const promptQuestions = await inquirer.prompt([
            {
                type: 'input',
                name: 'numbers',
                message: 'Number of questions you want to answer: ',
                default: 10
            }
        ])
        amount = Number(promptQuestions.numbers);
        console.log('\n')
            const promptLevel = await inquirer.prompt([
             {
                 type: 'rawlist',
                 name: 'level',
                 message: 'Select difficulty level: ',
                 choices: [
                     {
                         value: 'easy',
                         name: chalk.green.bold('easy')
                     },
                     {
                         value: 'medium',
                         name: chalk.yellow.bold('medium')
                     },
                     {
                         value: 'hard',
                         name: chalk.magenta.bold('hard')
                     }
                 ]
             }
         ])
         console.log('\n')
        return {
            questions: amount || 10,
            level: await promptLevel.level
        }
    }

    async playConfirmation(): Promise<void> {
        const promptConfirm = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to play again? '
            }
        ])
        if(promptConfirm.confirm) {
            this.init()
        }
    }

    async promptQuestions(q: IQuestion): Promise<string> {
        const answers = await inquirer.prompt([
            {
                type: 'rawlist',
                name: 'ans',
                message: chalk.bgCyan(q.question),
                choices: q.options.map((q, i) => {
                    return {
                        value: q,
                        name: chalk.green(q)
                    }
                })
            }
        ])
        console.log(`
                        ${chalk.gray('--------')}                
                    `)
        return answers.ans 
    }

    filterData(data: IQuestionsResults[]) {
        let _questions: IQuestion[] = [];
      

        if(data.length > 0) {
            _questions = data.map((d) => {
                const options = [...d.incorrect_answers, d.correct_answer].sort();
                return {
                    question: d.question,
                    correct: d.correct_answer,
                    category: d.category,
                    options
                }
            })
        }
        return _questions;
    }
};

const app = new App(new Model);
app.init()