/**
 * Defines the passport config
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { Application } from 'express';
import * as _passport from 'passport';

import LocalStrategy from '../services/strategies/Local';
import GoogleStrategy from '../services/strategies/Google';

import Log from '../middlewares/Log';
import IUserService from '../interfaces/IUserService';
import userService from '../services/userService';
import { IRequest, IResponse } from '../interfaces/vendors';
import { AuthFailureResponse } from '../core/ApiResponse';
import { UserRole } from '../interfaces/models/User';

class Passport {

	public mountPackage(_express: Application, passport?: _passport.PassportStatic): Application {
		let localPassport: _passport.PassportStatic;
		let _user: IUserService = new userService();

		localPassport = passport || _passport;

		_express = _express.use(localPassport.initialize());
		_express = _express.use(localPassport.session());

		localPassport.serializeUser<any, any>((req, user, done) => {
			done(null, user);
		});

		localPassport.deserializeUser<any, any>((req, sessionData, done) => {
			_user.getUserById(sessionData.id).then(u => {
				done(null, u);
			}).catch(e => {
				done(e, null);
			})
		});

		this.mountLocalStrategies(localPassport);

		return _express;
	}

	public mountLocalStrategies(passport: _passport.PassportStatic): void {
		try {
			LocalStrategy.init(passport);
			GoogleStrategy.init(passport);
		} catch (_err: any) {
			Log.error(_err.stack);
		}
	}

	public isAuthenticated(req: IRequest, res: IResponse, next: any): any {
		if (req.isAuthenticated()) {
			return next();
		}

		return new AuthFailureResponse('Fail', {
			message: 'You are not authenticated!',
		}).send(res);
	}

	public isAuthorized(req: IRequest, res: IResponse, next: any): any {
		const provider = req.path.split('/').slice(-1)[0];
		const token = req.session.passport.user.tokens?.find(token => token.kind === provider);
		if (token) {
			return next();
		} else {
			return res.redirect(`/auth/${provider}`);
		}
	}

	public isCustomer(req: IRequest, res: IResponse, next: any): any {
		const roles: Array<UserRole> = req.session.passport.user.roles;
		if (roles.length > 0) {
			if (roles.filter(role => role.roleName === 'customer').length <= 0) {
				return new AuthFailureResponse('Fail', {
					message: 'You are not autorized to use this role!',
				}).send(res);
			}
		} else {
			return new AuthFailureResponse('Fail', {
				message: 'You are not autorized to use this role!',
			}).send(res);
		}
		return next();
	}
}

export default new Passport;
