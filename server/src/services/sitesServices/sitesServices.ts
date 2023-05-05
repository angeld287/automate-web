import ISitesService from "../../interfaces/ISitesService";
import ISite from "../../interfaces/models/ISite";
import Database from "../../providers/Database";

export class sitesService implements ISitesService {
    async createSite(site: ISite): Promise<ISite> {
        try {
            const createSite = {
                name: 'create-new-site',
                text: 'INSERT INTO public.sites(name, domain, created_by) VALUES ($1, $2, $3) RETURNING name, domain, created_by;',
                values: [site.name, site.domain, site.createdBy],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createSite);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _subtitle: ISite = {
                id: result.rows[0].id,
                name: result.rows[0].name,
                domain: result.rows[0].domain,
                createdBy: result.rows[0].created_by,
            }
            
            return _subtitle;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateArticle(site: ISite): Promise<ISite | false> {
        try {
            const updateSite = {
                name: 'update-site',
                text: 'UPDATE public.sites SET name=$1, domain=$2 WHERE id = $3 RETURNING name, domain, created_by;',
                values: [site.name, site.domain, site.id],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, updateSite);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _article: ISite = {
                id: result.rows[0].id,
                name: result.rows[0].name,
                domain: result.rows[0].domain,
                createdBy: result.rows[0].created_by,
            }
            
            return _article;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSiteListByOwner(userId: number): Promise<Array<ISite>> {
        const getQuery = {
            name: 'get-sites-by-owner',
            text:  `SELECT name, domain, created_by FROM public.sites where created_by = $1;`,
            values: [userId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const contents: Array<ISite> = []

            result.rows.forEach(row => {
                contents.push({
                    id: row.id,
                    name: row.name,
                    domain: row.domain,
                    createdBy: row.created_by,
                })
            });
            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}