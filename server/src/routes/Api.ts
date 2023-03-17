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
import SearchKeywordController from '../controllers/Api/Job/SearchKeyword';
import KeywordsController from '../controllers/Api/Keywords/Keywords';

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
    body('from', 'from cannot be blank.').notEmpty(),
    body('to', 'to cannot be blank.').notEmpty(),
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
    '/translateKeyword',
    body('keyword', 'field keyword cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ContentController.translateKeyword
);

router.post(
    '/searchKeywords',
    body('article', 'field article cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ContentController.searchKeywords
);

router.get(
    '/getSubtitleFromDb',
    Passport.isAuthenticated,
    ArticleController.getSubtitleById
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
    body('type', 'field type cannot be blank.').notEmpty(),
    body('relatedId', 'field relatedId cannot be blank.').notEmpty(),
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

router.delete(
    '/deleteImage',
    body('id', 'field id cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    MediaController.deleteMedia
);


router.get(
    '/categoryList',
    Passport.isAuthenticated,
    Categoryontroller.getCategoryList
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
    body('orderNumber', 'field orderNumber cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createSubtitle
);


router.post(
    '/createArticle',
    body('title', 'field title cannot be blank.').notEmpty(),
    body('category', 'field category cannot be blank.').notEmpty(),
    body('translatedTitle', 'field translatedTitle cannot be blank.').notEmpty(),
    body('sysState', 'field sysState cannot be blank.').notEmpty(),
    body('jobId', 'field jobId cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createArticle
);

router.post(
    '/createPlanningArticle',
    body('category', 'field category cannot be blank.').notEmpty(),
    body('sysState', 'field sysState cannot be blank.').notEmpty(),
    body('jobId', 'field jobId cannot be blank.').notEmpty(),
    body('title', 'field title cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createArticle
);

router.post(
    '/article/updateTitle',
    body('id', 'field category cannot be blank.').notEmpty(),
    body('title', 'field title cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.updateArticleTitle
);

router.post(
    '/article/updateState',
    body('id', 'field category cannot be blank.').notEmpty(),
    body('state', 'field state cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.updateArticleState
);

router.get(
    '/getArticle',
    Passport.isAuthenticated,
    ArticleController.getArticle
);

router.get(
    '/getArticles',
    Passport.isAuthenticated,
    ArticleController.getArticles
);

router.get(
    '/getPlanningArticles',
    Passport.isAuthenticated,
    ArticleController.getPlanningArticles
);

router.post(
    '/createArticleContent',
    body('content', 'field content cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createContentForArticle
);

router.post(
    '/createSubtitleContent',
    body('content', 'field content cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    ArticleController.createContentForSubtitle
);

router.post(
    '/keywordsSearchJob/start',
    body('longTailKeyword', 'field longTailKeyword cannot be blank.').notEmpty(),
    body('mainKeyword', 'field mainKeyword cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    SearchKeywordController.startJob
);

router.post(
    '/keywordsSearchJob/stop',
    body('jobId', 'field jobId cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    SearchKeywordController.stopJob
);

router.post(
    '/keywordsSearchJob/getDetails',
    body('jobId', 'field jobId cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    SearchKeywordController.getJobDetails
);

router.get(
    '/keywords/getSearchJob',
    Passport.isAuthenticated,
    KeywordsController.getSearchJob
);

router.get(
    '/keywords/getAllSearchJobs',
    Passport.isAuthenticated,
    KeywordsController.getAllSearchJobs
);

router.post(
    '/keywords/selectPotentialKeyword',
    body('id', 'field id cannot be blank.').notEmpty(),
    body('selected', 'field selected cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    KeywordsController.selectPotentialKeyword
);

router.post(
    '/keywords/addRemoveKeywordToArticle',
    body('id', 'field id cannot be blank.').notEmpty(),
    //body('articleId', 'field articleId cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    KeywordsController.addRemoveKeywordToArticle
);

router.post(
    '/keywords/setMainKeyword',
    body('id', 'field id cannot be blank.').notEmpty(),
    body('isMain', 'field isMain cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    KeywordsController.setMainKeyword
);

router.get(
    '/keywords/getAllByArticleId',
    Passport.isAuthenticated,
    KeywordsController.getArticleKeywords
);

router.post(
    '/keywords/createForArticle',
    body('articleId', 'field articleId cannot be blank.').notEmpty(),
    body('name', 'field name cannot be blank.').notEmpty(),
    body('orderNumber', 'field orderNumber cannot be blank.').notEmpty(),
    Passport.isAuthenticated,
    KeywordsController.createKeywordForArticle
);

export default router;