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
        

        const TOCKEN_URL = `${WP_JSON_URL}/jwt-auth/v1/token`

        const  WS_BACKEND_BASE_URL = `http://localhost:3002/api/`

        const DEFAULT_IMAGE = 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
        

        return {

            WP_JSON_URL,
            WP_API_BASE_URL,
            TOCKEN_URL,
            WS_BACKEND_BASE_URL,
            DEFAULT_IMAGE,
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