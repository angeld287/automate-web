/**
 * Defines all the requisites in HTTP
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import * as cors from 'cors';
import * as express from 'express';
import * as flash from 'express-flash';
import * as compress from 'compression';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

import Log from './Log';
import Locals from '../providers/Locals';
import Passport from '../providers/Passport';
import CORS from './CORS';
import * as connectRedis from "connect-redis";
import { createClient } from "redis";

class Http {
	public static mount(_express: express.Application): express.Application {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(bodyParser.urlencoded({ extended: false }));
		_express.use(bodyParser.json());

		_express.use(express.json());

		// Disable the x-powered-by header in response
		_express.disable('x-powered-by');

		// Enables the request flash messages
		_express.use(flash());

		/**
		 * Enables the session store
		 *
		 * Note: You can also add redis-store
		 * into the options object.
		 */

		//Configuring redis store for session 172.18.0.2
		let RedisStore = connectRedis(session)
		let redisClient = createClient({
			socket: {
				host: Locals.config().REDIS_HTTPHOST,
				port: Locals.config().REDIS_HTTPPORT
			},
			legacyMode: true,
		})
		redisClient.connect().catch(console.error)

		const options: session.SessionOptions  = {
			resave: true,
    		saveUninitialized: true,
			secret: Locals.config().appSecret,
			cookie: {
				maxAge: 6300000, // two weeks (in ms)
				//The session error occurs because we need to disable the "Back-forward cache" chrome flag "chrome://flags/"
				//In addition we need to comment the sameSite option and set secure to true.
				//Before of the aplication deployment we need to research the way to solve this for producction build.
				//sameSite: 'none',
				secure: false
			},
			store: new RedisStore({ client: redisClient })
		};

		_express.use(session(options));

		// Enables the CORS
		_express = CORS.mount(_express);

		// Enables the "gzip" / "deflate" compression for response
		_express.use(compress());

		// Loads the passport configuration
		_express = Passport.mountPackage(_express);

		return _express;
	}
}

export default Http;
