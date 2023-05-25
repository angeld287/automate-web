import ISitesService from "../../interfaces/ISitesService";
import ISite from "../../interfaces/models/ISite";
import Database from "../../providers/Database";

export class sitesService implements ISitesService {
    async createSite(site: ISite): Promise<ISite> {
        try {
            const createSite = {
                name: 'create-new-site',
                text: 'INSERT INTO public.sites(name, domain, created_by, selected) VALUES ($1, $2, $3, $4) RETURNING name, domain, created_by, selected;',
                values: [site.name, site.domain, site.createdBy, site.selected],
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
                name: result.rows[0].name.trim(),
                domain: result.rows[0].domain.trim(),
                createdBy: result.rows[0].created_by,
                selected: result.rows[0].selected,
            }
            
            return _subtitle;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateSite(site: ISite): Promise<ISite | false> {
        try {
            const updateSite = {
                name: 'update-site',
                text: 'UPDATE public.sites SET name=$1, domain=$2, selected=$3 WHERE id = $4 RETURNING name, domain, created_by, selected, id',
                values: [site.name, site.domain, site.selected, site.id],
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

            let _site: ISite = {
                id: result.rows[0].id,
                name: result.rows[0].name.trim(),
                domain: result.rows[0].domain.trim(),
                createdBy: result.rows[0].created_by,
                selected: result.rows[0].selected,
            }
            
            return _site;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSiteListByOwner(userId: number): Promise<Array<ISite>> {
        const getQuery = {
            name: 'get-sites-by-owner',
            text:  `SELECT id, name, domain, created_by, selected FROM public.sites where created_by = $1;`,
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
                    name: row.name.trim(),
                    domain: row.domain.trim(),
                    createdBy: row.created_by,
                    selected: row.selected,
                })
            });
            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getSiteById(id: number): Promise<ISite | false> {
        const getQuery = {
            name: 'get-site-by-id',
            text:  `SELECT id, name, domain, created_by, selected FROM public.sites where id = $1;`,
            values: [id]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            let _site: ISite = {
                id: result.rows[0].id,
                name: result.rows[0].name.trim(),
                domain: result.rows[0].domain.trim(),
                createdBy: result.rows[0].created_by,
                selected: result.rows[0].selected
            }
            
            return _site;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}