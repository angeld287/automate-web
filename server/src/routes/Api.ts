/**
 * Define all your API web-routes
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */
import { body, check } from 'express-validator';
import { Router } from 'express';

import LoginController from '../controllers/Api/Auth/Login'
import RegisterController from '../controllers/Api/Auth/Register'
import LogoutController from '../controllers/Api/Auth/Logout';
import PageSource from '../controllers/Api/Pages/PageSource';
import Passport from '../providers/Passport';
import Session from '../controllers/Api/Auth/Session';
import ContentController from '../controllers/Api/Content/Content';
import TranslateController from '../controllers/Api/Content/Translate';
import PostController from '../controllers/Api/Content/Post';
import MediaController from '../controllers/Api/Content/Media';
import Categoryontroller from '../controllers/Api/Content/Category';
import ArticleController from '../controllers/Api/Article/Article';

const router = Router();

router.post(
    '/auth/login',
    body('username', 'E-mail cannot be blank.').notEmpty(),
    body('username', 'E-mail is not valid.').isEmail(),
    body('password', 'Password cannot be blank.').notEmpty(),
    body('password', 'Password length must be atleast 8 characters.').isLength({ min: 8 }),
    body('username').normalizeEmail({ gmail_remove_dots: false }),
    LoginController.perform
);

router.post(
    '/auth/register',
    body('username', 'Username cannot be blank.').notEmpty(),

    body('email', 'E-mail cannot be blank.').notEmpty(),
    body('email', 'E-mail is not valid.').isEmail(),
    body('email').normalizeEmail({ gmail_remove_dots: false }),

    body('phoneNumber', 'Phone Number cannot be blank.').notEmpty(),
    check('phoneNumber', 'invalid Phone Number format.').custom((value) => RegisterController.isPhoneNumber(value)),

    body('password', 'Password cannot be blank.').notEmpty(),
    body('password', 'Password length must be atleast 8 characters.').isLength({ min: 8 }),
    body('confirmPassword', 'Confirmation Password cannot be blank.').notEmpty(),

    check("password", "invalid password.").custom((value, { req }) => RegisterController.verifyPasswordsMatch(value, req)),

    body('fullName', 'fullName cannot be blank.').notEmpty(),

    body('gender', 'Gender cannot be blank.').notEmpty(),


    RegisterController.perform
);

router.post(
    '/auth/logout',
    LogoutController.perform
);

router.post(
    '/getPageSource',
    body('url', 'url cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    PageSource.getPageSource
);

router.post(
    '/translate',
    body('text', 'text cannot be blank.').notEmpty(),
    body('language', 'language cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    TranslateController.perform
);

router.get(
    '/auth/getsession',
    Session.perform
);

router.post(
    '/createContent',
    body('article', 'field article cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ContentController.createContent
);

//routes for process
router.post(
    '/translateKeywords',
    body('article', 'field article cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ContentController.translateKeywords
);

router.post(
    '/searchKeywords',
    body('article', 'field article cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ContentController.searchKeywords
);

router.post(
    '/searchKeyword',
    body('subtitle', 'field subtitle cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ContentController.searchKeyword
);

router.post(
    '/translateParagraphs',
    body('article', 'field article cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ContentController.translateParagraphs
);

router.post(
    '/createPost',
    body('article', 'field article cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    PostController.create
);

router.post(
    '/uploadImage',
    body('imageAddress', 'field imageAddress cannot be blank.').notEmpty(),
    body('title', 'field title cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    MediaController.create
);

router.post(
    '/updateImageProps',
    body('id', 'field id cannot be blank.').notEmpty(),
    body('title', 'field title cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    MediaController.updateMediaTitles
);

router.post(
    '/addCategory',
    body('name', 'field name cannot be blank.').notEmpty(),
    body('description', 'field description cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    Categoryontroller.create
);

router.post(
    '/updateCategory',
    body('id', 'field id cannot be blank.').notEmpty(),
    body('name', 'field name cannot be blank.').notEmpty(),
    body('description', 'field description cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    Categoryontroller.update
);



//Articles DB Endpoints
router.post(
    '/createSubtitle',
    body('name', 'field name cannot be blank.').notEmpty(),
    body('translatedName', 'field translatedName cannot be blank.').notEmpty(),
    body('articleId', 'field articleId cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createSubtitle
);


router.post(
    '/createArticle',
    body('title', 'field content cannot be blank.').notEmpty(),
    body('category', 'field selected cannot be blank.').notEmpty(),
    body('translatedTitle', 'field contentLanguage cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createArticle
);

router.get(
    '/getArticles',
    Passport.isAuthenticated,
    ArticleController.getArticles
);

router.post(
    '/createArticleContent',
    body('content', 'field content cannot be blank.').notEmpty(),
    body('selected', 'field selected cannot be blank.').notEmpty(),
    body('contentLanguage', 'field contentLanguage cannot be blank.').notEmpty(),
    body('articleId', 'field articleId cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createContentForArticle
);

router.post(
    '/createSubtitleContent',
    body('content', 'field content cannot be blank.').notEmpty(),
    body('selected', 'field selected cannot be blank.').notEmpty(),
    body('contentLanguage', 'field contentLanguage cannot be blank.').notEmpty(),
    body('subtitleId', 'field subtitleId cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createContentForSubtitle
);

export default router;