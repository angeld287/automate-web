/**
 * Define Login Login for the API
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import Encryptions from '../../../providers/Encryptions'

import Log from '../../../middlewares/Log';
import IUser, { UserRole } from "../../../interfaces/models/User";
import IUserService from "../../../interfaces/IUserService";
import userService from '../../../services/userService';
var passport = require('passport');
import { IResponse, IRequest, INext } from '../../../interfaces/vendors';
import { AuthFailureResponse, BadRequestResponse, SuccessResponse } from '../../../core/ApiResponse';
import ExpressValidator from '../../../providers/ExpressValidation';
import ILogin from '../../../interfaces/wordpress/ILogin';
import WpLogin from '../../../services/wordpress/login';
import ISitesService from '../../../interfaces/ISitesService';
import { sitesService } from '../../../services/sitesServices/sitesServices';


class Login {

    /**
     * Execute the action of login an user if the inputs are valid
     * @param {string} req: get the request from the post
     * @param {string} res: the response expected by the post
     * @return {Promise<>} return a promise with the json result
     */
    public static async perform(req: IRequest, res: IResponse, next: INext): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);
            let user: IUserService = new userService();
            let login: ILogin = new WpLogin();

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const _username = req.body.username.toLowerCase();
            const _password = Encryptions.hash(req.body.password);
            req.body.password = _password;


            const userVerifications: Array<any> = await Promise.all(
                [
                    user.checkIfUserComesFromGoogle(_username),
                    user.validateUser(_username, _password),
                ]
            );

            if (userVerifications[0]) {
                return new BadRequestResponse('Error', {
                    error: true,
                    message: 'User exist in the sistem as created from Google. Please login with google.',
                }).send(res);
            }

            const _user = userVerifications[1];

            if (_user === false) {

                return new BadRequestResponse('Error', {
                    error: true,
                    message: 'Invalid Username or Password',
                }).send(res);
            }

            Log.info(`New user logged ` + _username);

            const userRoles: Array<UserRole> = await user.getUserRoles(_user.id)
            //const wpToken: any = await login.getTokenWithCredentials(_username, _password);
            const _siteService: ISitesService = new sitesService();

            const defaultSite = (await _siteService.getSiteListByOwner(_user.id)).find(site => site.selected);

            const wpToken: any = await login.getToken(defaultSite.id);

            let userObject: IUser = {
                id: _user.id,
                email: _user.email,
                phoneNumber: _user.phone_number,
                passwordResetToken: _user.password_reset_token,
                passwordResetExpires: _user.password_reset_expires,
                fullname: _user.fullname,
                gender: _user.gender,
                profile: _user.profile,
                userName: _user.user_name,
                roles: userRoles,
                wpToken
            };

            passport.authenticate('local', (err: any, user: any, info: any) => {
                Log.info('Here in the login controller #2!');

                if (err) {
                    return next(err);
                }

                if (info) {
                    return new AuthFailureResponse('Validation Error', {
                        error: true,
                        message: info.message || info.msg,
                    }).send(res);
                }

                return req.logIn({ ...userObject }, () => {
                    return new SuccessResponse('Success', {
                        session: req.session.passport.user,
                    }).send(res);
                });

            })(req, res, next);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new AuthFailureResponse('Validation Error', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Login;