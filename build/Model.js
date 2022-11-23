var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
export class Model {
    constructor() {
        this.API_URL = 'https://opentdb.com/api.php'; // ?amount=10&difficulty=easy&type=multiple
    }
    generateQuestions(types) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questions, level } = types;
            let response;
            try {
                const requestOptions = {
                    method: 'GET',
                    redirect: 'follow',
                };
                const res = yield fetch(`https://opentdb.com/api.php?amount=${questions}&difficulty=${level}&type=multiple`, requestOptions);
                response = (yield res.json());
            }
            catch (err) {
                console.log(err);
                response = err;
            }
            return response;
        });
    }
    getUserTypes(types) {
        return __awaiter(this, void 0, void 0, function* () {
            if (types) {
                const response = yield this.generateQuestions(types);
                return response;
            }
        });
    }
}
