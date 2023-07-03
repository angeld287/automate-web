import IBacklinksServices from "../../interfaces/IBacklinksServices";
import IBacklink from "../../interfaces/models/IBacklink";
import Database from "../../providers/Database";

export class BacklinksServices implements IBacklinksServices {
    async createSite(backlink: IBacklink): Promise<IBacklink> {
        try {
            const createbacklink = {
                name: 'create-new-backlink',
                text: 'INSERT INTO public.possible_backlinks(name, domain, created_by, selected) VALUES ($1, $2, $3, $4) RETURNING name, domain, created_by, selected, wp_user, wp_user_pass;',
                values: [],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, createbacklink);
                await Database.commit(client);
            } catch (error) {
                await Database.rollback(client);
                throw new Error(error);
            }

            let _backlink: IBacklink = {
                id: result.rows[0].id,
                link: result.rows[0].link.trim(),
                rel: result.rows[0].rel.trim(),
                state: result.rows[0].state.trim(),
                accountUser: result.rows[0].account_user.trim(),
                accountUserPass: result.rows[0].account_user_pass.trim(),
                createdBy: result.rows[0].created_by,
            }
            
            return _backlink;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateSite(site: IBacklink): Promise<IBacklink | false> {
        try {
            const updateSite = {
                name: 'update-backlink',
                text: 'UPDATE public.possible_backlinks SET name=$1, domain=$2, selected=$3, wp_user=$4, wp_user_pass=$5 WHERE id = $6 RETURNING name, domain, created_by, selected, id, wp_user, wp_user_pass',
                values: [],
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

            let _backlink: IBacklink = {
                id: result.rows[0].id,
                link: result.rows[0].link.trim(),
                rel: result.rows[0].rel.trim(),
                state: result.rows[0].state.trim(),
                accountUser: result.rows[0].account_user.trim(),
                accountUserPass: result.rows[0].account_user_pass.trim(),
                createdBy: result.rows[0].created_by,
            }
            
            return _backlink;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getBacklinksByOwner(userId: number): Promise<Array<IBacklink>> {
        const getQuery = {
            name: 'get-backlinks-by-owner',
            text:  `SELECT id, name, domain, created_by, selected, wp_user, wp_user_pass FROM public.possible_backlinks where created_by = $1;`,
            values: [userId]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return []
            
            const contents: Array<IBacklink> = []

            result.rows.forEach(row => {
                contents.push({
                    id: row.id,
                    link: row.link.trim(),
                    rel: row.rel.trim(),
                    state: row.state.trim(),
                    accountUser: row.account_user.trim(),
                    accountUserPass: row.account_user_pass.trim(),
                    createdBy: row.created_by,
                })
            });
            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getBacklinkById(id: number): Promise<IBacklink | false> {
        const getQuery = {
            name: 'get-backlink-by-id',
            text:  `SELECT id, name, domain, created_by, selected, wp_user, wp_user_pass FROM public.possible_backlinks where id = $1;`,
            values: [id]
        };

        let result = null;
        try {
            result = await Database.sqlToDB(getQuery);
            
            if (result.rows.length === 0)
                return false
            
            let _backlink: IBacklink = {
                id: result.rows[0].id,
                link: result.rows[0].link.trim(),
                rel: result.rows[0].rel.trim(),
                state: result.rows[0].state.trim(),
                accountUser: result.rows[0].account_user.trim(),
                accountUserPass: result.rows[0].account_user_pass.trim(),
                createdBy: result.rows[0].created_by,
            }
            
            return _backlink;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}