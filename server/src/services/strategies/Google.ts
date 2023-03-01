/**
 * Define Google OAuth2
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import { Strategy, StrategyOptionsWithRequest } from 'passport-google-oauth20';
import IUserService from '../../interfaces/IUserService';
import IUser from '../../interfaces/models/User';
import ILogin from '../../interfaces/wordpress/ILogin';
import Locals from '../../providers/Locals';
import userService from '../userService';
import WpLogin from '../wordpress/login';

class Google {
	public static init(_passport: any): any {
		let user: IUserService = new userService()
		try {
			const options: StrategyOptionsWithRequest = {
				clientID: Locals.config().GOOGLE_AUTH_CLIENT_ID,
				clientSecret: Locals.config().GOOGLE_AUTH_CLIENT_SECRET,
				callbackURL: `${Locals.config().url}/auth/google/callback`,
				passReqToCallback: true,
			}

			const _strategy: Strategy = new Strategy(options, async (req: any, accessToken: any, refreshToken: any, profile: any, done: any) => {

				let googleUserExist: IUser | false = await user.getUserByGoogle(profile.id)
				let login: ILogin = new WpLogin();
				const wpToken: any = await login.getToken();

				if (googleUserExist !== false) {
					googleUserExist.wpToken = wpToken;
					return done(null, googleUserExist);
				}

				const emailIsBusy = await user.verifyIfEmailExist(profile.emails[0].value)

				if (emailIsBusy.exist) {
					req.flash('errors', { msg: 'There is already an account using this email address. Sing in to that accoount and link it with Google manually from Account Settings.' });
					return done(null);
				}

				const newUserProfile = await user.createNewFederatedAuthProfiles(profile.provider, profile.id)

				let userData: IUser = {
					id: '',
					email: profile.emails[0].value,
					fullname: profile.displayName,
					userName: '',
					password: 'google',
					roles: [],
					wpToken,
				}

				const createUser = await user.createNewUserFromGoogle(userData, newUserProfile.id);
				await user.createNewUserProfileImage(profile._json.picture, createUser.id)
				await user.addUserToRole(createUser.id, 'customer')

				googleUserExist = await user.getUserByGoogle(profile.id)

				return done(null, googleUserExist)
			});

			_passport.use(_strategy);
		} catch (error) {
			console.log('Google Strategy Error: ', error)
		}

	}
}

export default Google;
