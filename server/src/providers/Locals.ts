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
        const port = process.env.PORT || 3001;
        const DATABASE_URL = process.env.DATABASE_URL || 'postgres://admin:admin@localhost:35432/db';

        const appSecret = process.env.APP_SECRET || 'secret_key';
        const apiPrefix = process.env.API_PREFIX || 'api';

        //allow origin cors
        const url = process.env.APP_URL || `http://localhost:3003`;

        const clientId = process.env.GOOGLE_ID || "a.apps.googleusercontent.com";
        const clientSecret = process.env.GOOGLE_SECRET || "ks";

        //Search Engine Configuration
        const googleCustomSearch = "https://www.googleapis.com/customsearch/v1?";
        const googleEngineKey = process.env.GOOGLE_ENGINE_KEY || "key=k";
        const googleContext = process.env.GOOGLE_CONTEXT || "cx=c"
        const SEARCH_ENGINE_URL = `${googleCustomSearch}&${googleEngineKey}&${googleContext}`
        const GOOGLE_RESULTS_QUANTITY = 10;

        //Bing Translate Configuration
        const translateApiUrl = "https://microsoft-translator-text.p.rapidapi.com/translate";
        const rapiApiKey = process.env.RAPID_API_KEY || "rak";
        const rapiApiHost = "microsoft-translator-text.p.rapidapi.com";
        const MIN_CHARACTERS_LENGTH = 680;

        //wordpress site configuration
        const wordpressDomain = "elaceite.de"
        const WP_JSON_URL = `https://${wordpressDomain}/wp-json`
        const wordpressUrl = `${WP_JSON_URL}/wp/v2/`
        const WORDPRESS_USER = process.env.WORDPRESS_USER || "admin"
        const WORDPRESS_USER_PASSWORD = process.env.WORDPRESS_USER_PASSWORD || "admin"

        //paragraph extraction configurations
        const NUMBER_OF_PARAGRAPHS_ALLOWED = 3
        const MIN_CHARACTERS_IN_SNIPPED = 70
        const MIN_WORDS_IN_SNIPPED = 8
        const MIN_WORDS_IN_PARAGRAPH = 20
        const MAX_WORDS_IN_PARAGRAPH = 150
        const MIN_PAGE_SOURCE_LENGTH = 500

        //Media Configurations
        const DOWNLOADED_IMAGES_PATH = "media/"
        const DOWNLOADED_IMAGES_COMPRESSED_PATH = "media/compressed/"
        const POST_IMAGE_WIDTH = 590;
        const POST_IMAGE_HEIGHT = 350;

        //Redis Configuration
        const REDIS_PREFIX = 3
        const REDIS_HTTPPORT = 6379
        const REDIS_HTTPHOST = "127.0.0.1"
        const REDIS_DB = "q"


        return {
            apiPrefix,
            appSecret,
            port,
            dbUrl: DATABASE_URL,
            url,
            clientId,
            clientSecret,

            SEARCH_ENGINE_URL,
            GOOGLE_RESULTS_QUANTITY,

            translateApiUrl,
            rapiApiKey,
            rapiApiHost,
            MIN_CHARACTERS_LENGTH,

            WP_JSON_URL,
            wordpressUrl,
            WORDPRESS_USER,
            WORDPRESS_USER_PASSWORD,

            MIN_CHARACTERS_IN_SNIPPED,
            MIN_WORDS_IN_SNIPPED,
            MIN_WORDS_IN_PARAGRAPH,
            MAX_WORDS_IN_PARAGRAPH,
            NUMBER_OF_PARAGRAPHS_ALLOWED,
            MIN_PAGE_SOURCE_LENGTH,

            DOWNLOADED_IMAGES_PATH,
            DOWNLOADED_IMAGES_COMPRESSED_PATH,
            POST_IMAGE_WIDTH,
            POST_IMAGE_HEIGHT,
            
            REDIS_PREFIX,
            REDIS_HTTPPORT,
            REDIS_HTTPHOST,
            REDIS_DB,
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