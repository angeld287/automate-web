/**
 * Define App Locals & Configs
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { Application } from 'express'

class Locals {

    /**
     * Makes env configs available for your app
     * throughout the app's runtime
     */
    public static config(): any {

        //wordpress site configuration
        const wordpressDomain = "elaceite.de"
        const WP_JSON_URL = `https://${wordpressDomain}/wp-json`
        const WP_API_BASE_URL = `${WP_JSON_URL}/wp/v2/`
        const WORDPRESS_USER = process.env.REACT_APP_WORDPRESS_USER || "automator"
        const WORDPRESS_USER_PASSWORD = process.env.REACT_APP_WORDPRESS_USER_PASSWORD || "admin"

        const TOCKEN_URL = `${WP_JSON_URL}/jwt-auth/v1/token`

        const  WS_BACKEND_BASE_URL = `http://localhost:3002/api/`
        

        return {

            WP_JSON_URL,
            WP_API_BASE_URL,
            TOCKEN_URL,
            WORDPRESS_USER,
            WORDPRESS_USER_PASSWORD,
            WS_BACKEND_BASE_URL,
        }
    }

    /**
     * Injects your config to the app's locals
     */
    public static init(_express: Application): Application {
        _express.locals.app = this.config();
        return _express;
    }
}

export default Locals;