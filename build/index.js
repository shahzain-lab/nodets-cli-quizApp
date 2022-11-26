#!/usr/bin/env node

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import inquirer from "inquirer";
import { Model } from "./Model.js";
import figlet from 'figlet';
import gradient from 'gradient-string';
// https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple
class App {
    constructor(model) {
        this.model = model;
        this.data = [];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let corrects = [];
            let incorrects = [];
            const types = yield this.gameInterval();
            const res = yield this.model.getUserTypes(types);
            if (res && typeof res !== 'string') {
                const data = res.results;
                const questions = this.filterData(data);
                this.data = questions;
                for (let i = 0; i < questions.length; i++) {
                    const ans = yield this.promptQuestions(questions[i]);
                    if (questions[i].correct === ans) {
                        corrects.push(ans);
                    }
                    else {
                        incorrects.push(ans);
                    }
                    ;
                }
                console.log(`
           ${chalk.bgGreen(`Your ${corrects.length} questions are corrects and ${incorrects.length} questions are incorrects.`)}\n
           ${chalk.green.bold('Correct Answers')}
           ${corrects.map((c, i) => `\n${chalk.blue(i + 1)}: ${chalk.magenta(c)}`)}
           `);
                console.log(`
           ${chalk.yellow.bold('Incorrect Answers')}
           ${incorrects.map((c, i) => `\n${chalk.blue(i + 1)}: ${chalk.red(c)}`)}
           `);
                this.playConfirmation();
            }
        });
    }
    gameInterval() {
        return __awaiter(this, void 0, void 0, function* () {
            let amount;
            const promptQuestions = yield inquirer.prompt([
                {
                    type: 'input',
                    name: 'numbers',
                    message: 'Number of questions you want to answer: ',
                    default: 10
                }
            ]);
            amount = Number(promptQuestions.numbers);
            console.log('\n');
            const promptLevel = yield inquirer.prompt([
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
                            name: chalk.green.bold('medium')
                        },
                        {
                            value: 'hard',
                            name: chalk.green.bold('hard')
                        }
                    ]
                }
            ]);
            console.log('\n');
            return {
                questions: amount || 10,
                level: yield promptLevel.level
            };
        });
    }
    playConfirmation() {
        return __awaiter(this, void 0, void 0, function* () {
            const promptConfirm = yield inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Do you want to play again? '
                }
            ]);
            if (promptConfirm.confirm) {
                this.init();
            }
        });
    }
    promptQuestions(q) {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = yield inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'ans',
                    message: chalk.bgCyan(q.question),
                    choices: q.options.map((q, i) => {
                        return {
                            value: q,
                            name: chalk.green(q)
                        };
                    })
                }
            ]);
            console.log(`
                        ${chalk.gray('--------')}                
                    `);
            return answers.ans;
        });
    }
    filterData(data) {
        let _questions = [];
        if (data.length > 0) {
            _questions = data.map((d) => {
                const options = [...d.incorrect_answers, d.correct_answer].sort();
                return {
                    question: d.question,
                    correct: d.correct_answer,
                    category: d.category,
                    options
                };
            });
        }
        return _questions;
    }
}
;
figlet.text('Triple-Quiz!', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
}, ((err, data) => {
    console.log('\n');
    console.log(gradient.rainbow(data));
    console.log('\n');
    const app = new App(new Model);
    app.init();
}));
