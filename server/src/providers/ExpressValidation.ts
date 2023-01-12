/**
 * Class to format the validation error results
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { ResultFactory, validationResult } from 'express-validator';
import { BadRequestResponse } from '../core/ApiResponse';
import { IValidationError } from '../interfaces/response/IValidationError';
import { IRequest, IResponse } from '../interfaces/vendors';

class ExpressValidator {
    public validator: ResultFactory<IValidationError>;
    constructor() {
        this.validator = validationResult.withDefaults({
            formatter: error => {
                const { msg, ...formatedError } = error;
                return {
                    message: error.msg,
                    ...formatedError
                };
            },
        })
    }
}

export class ValidateErrors {
    public static validate(req: IRequest, res: IResponse) {
        const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }else{
                return true
            }
    }
}

export default ExpressValidator;