/**
 * Get the html body of a web page
 *
 * @author Angel Angeles <aangeles@litystyles.com>
 */

import { BadRequestResponse, InternalErrorResponse, SuccessResponse } from '../../../core/ApiResponse';
import ISitesService from '../../../interfaces/ISitesService';
import { IRequest, IResponse } from '../../../interfaces/vendors';
import Log from '../../../middlewares/Log';
import ExpressValidator, { ValidateErrors } from '../../../providers/ExpressValidation';
import { sitesService } from '../../../services/sitesServices/sitesServices';

class Configurations {

    public static async createSite(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const { name, domain, selected } = req.body;
            const userId = req.session.passport.user.id;
            
            const siteService: ISitesService = new sitesService();

            const site = siteService.createSite({
                name,
                domain,
                createdBy: parseInt(userId),
                selected,
            });

            return new SuccessResponse('Success', {
                success: true,
                response: site,
                error: null,
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Configurations Controller Error - createSite', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async updateSite(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const { id, name, domain } = req.body.id;
            const userId = req.session.passport.user.id;
            
            const siteService: ISitesService = new sitesService();

            let site = await siteService.getSiteById(id);

            if(site === false){
                return new BadRequestResponse('Error', {
                    error: "The site does not exist."
                }).send(res);
            }

            if(site.createdBy !== parseInt(userId)){
                return new BadRequestResponse('Error', {
                    error: "You are not the site owner."
                }).send(res);
            }

            site.domain = domain;
            site.name = name;
            site = await siteService.updateSite(site);

            return new SuccessResponse('Success', {
                success: true,
                error: null,
                response: site
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Configurations Controller Error - updateSite', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async setSelectedSite(req: IRequest, res: IResponse): Promise<any> {
        try {
            const errors = new ExpressValidator().validator(req);

            if (!errors.isEmpty()) {
                return new BadRequestResponse('Error', {
                    errors: errors.array()
                }).send(res);
            }

            const { id } = req.body.id;
            const userId = req.session.passport.user.id;
            
            const siteService: ISitesService = new sitesService();

            let site = await siteService.getSiteById(id);

            if(site === false){
                return new BadRequestResponse('Error', {
                    error: "The site does not exist."
                }).send(res);
            }

            if(site.createdBy !== parseInt(userId)){
                return new BadRequestResponse('Error', {
                    error: "You are not the site owner."
                }).send(res);
            }

            site.selected
            site = await siteService.updateSite(site);

            const otherSites = (await siteService.getSiteListByOwner(parseInt(userId))).filter(_site => {
                if(site !== false)
                    return _site.id !== site.id
            })

            await Promise.all(otherSites.map(async (otherSite, index) => {
                otherSite.selected = false;
                await siteService.updateSite(otherSite);
            }));

            return new SuccessResponse('Success', {
                success: true,
                error: null,
                response: site
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Configurations Controller Error - updateSite', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }

    public static async getOwnerSiteList(req: IRequest, res: IResponse): Promise<any> {
        try {
            if(ValidateErrors.validate(req, res) !== true) return

            const siteService: ISitesService = new sitesService();
            const userId = req.session.passport.user.id;

            let sites = await siteService.getSiteListByOwner(parseInt(userId))
            
            return new SuccessResponse('Success', {
                success: true,
                response: sites,
                error: null
            }).send(res);

        } catch (error) {
            Log.error(`Internal Server Error ` + error);
            return new InternalErrorResponse('Configurations Controller Error - getOwnerSiteList', {
                error: 'Internal Server Error',
            }).send(res);
        }
    }
}

export default Configurations;