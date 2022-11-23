import axios from "axios";
import fetch from 'node-fetch'
import { IQuestionsResponse, IQuestionsTypes } from "./IQuestions.js";

type Stringable<T> = T | string; 

export class Model {
    private API_URL = 'https://opentdb.com/api.php';// ?amount=10&difficulty=easy&type=multiple


    private async generateQuestions(types: IQuestionsTypes): Promise<Stringable<IQuestionsResponse>> {
        const { questions, level } = types;
        let response: Stringable<IQuestionsResponse>;
        try{
        
             const requestOptions = {
              method: 'GET',
              redirect: 'follow' as RequestRedirect,
            };
        
           const res = await fetch(`https://opentdb.com/api.php?amount=${questions}&difficulty=${level}&type=multiple`, requestOptions)
           response = await res.json() as IQuestionsResponse;

        }catch(err) {
            console.log(err);
            response = err as string
        }

        return response
    }

    async getUserTypes(types: IQuestionsTypes): Promise<Stringable<IQuestionsResponse> | void> {
        if(types) {
            const response = await this.generateQuestions(types);
            return response;
        }
    }
}