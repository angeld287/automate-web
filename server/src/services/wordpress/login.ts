import ISitesService from "../../interfaces/ISitesService"
import ILogin, { IAuthenticate } from "../../interfaces/wordpress/ILogin"
import Locals from "../../providers/Locals"
import { fetch } from "../../utils"
import { sitesService } from "../sitesServices/sitesServices"


export default class WpLogin implements ILogin {

    async getToken(siteId: number): Promise<any> {

      const _siteService: ISitesService = new sitesService();

      const site = await _siteService.getSiteById(siteId);

      if(site){
        const authenticate: IAuthenticate = {
          username: site.wpUser,
          password: site.wpUserPass,
        }

        const result = await fetch(Locals.config().TOCKEN_URL(site.domain), {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authenticate)
        });
        
        return result
      }else{
        return null
      }
    }

    async getTokenWithCredentials(username: string, password: string, siteId: number): Promise<any> {
      const _siteService: ISitesService = new sitesService();

      const site = await _siteService.getSiteById(siteId);

      if(site){

        const authenticate: IAuthenticate = {
          username,
          password,
        }

        const result = await fetch(Locals.config().TOCKEN_URL(site.domain), {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(authenticate)
        });
        return result
      }else{
        return null
      }
      
  }
}