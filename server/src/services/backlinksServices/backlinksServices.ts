import IBacklinksServices from "../../interfaces/IBacklinksServices";
import IBacklink from "../../interfaces/models/IBacklink";
import Database from "../../providers/Database";

export class BacklinksServices implements IBacklinksServices {
    async createBacklink(backlink: IBacklink): Promise<IBacklink> {
        try {
            const createbacklink = {
                name: 'create-new-backlink',
                text: 'INSERT INTO public.possible_backlinks(link, rel, state, created_by, title, snippet) VALUES ($1, $2, $3, $4, $5, $6) RETURNING link, rel, state, created_by, account_user, account_user_pass, id, title, snippet;',
                values: [backlink.link, backlink.rel, backlink.state, backlink.createdBy, backlink.title, backlink.snippet],
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
                accountUser: result.rows[0].account_user,
                accountUserPass: result.rows[0].account_user_pass,
                createdBy: result.rows[0].created_by,
                title: result.rows[0].title.trim(),
                snippet: result.rows[0].snippet.trim()
            }
            
            return _backlink;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateBacklink(backlink: IBacklink): Promise<IBacklink | false> {
        try {
            const updateBacklink = {
                name: 'update-backlink',
                text: 'UPDATE public.possible_backlinks SET state=$2, account_user=$3, account_user_pass=$4 WHERE id = $1 RETURNING link, rel, state, created_by, account_user, account_user_pass, id, title, snippet',
                values: [backlink.id, backlink.state, backlink.accountUser, backlink.accountUserPass],
            }

            let result = null, client = null;

            client = await Database.getTransaction();

            try {
                result = await Database.sqlExecSingleRow(client, updateBacklink);
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
                title: result.rows[0].title.trim(),
                snippet: result.rows[0].snippet.trim()
            }
            
            return _backlink;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getBacklinksByOwner(userId: number): Promise<Array<IBacklink>> {
        const getQuery = {
            name: 'get-backlinks-by-owner',
            text:  `SELECT link, rel, state, created_by, account_user, account_user_pass, id, title, snippet FROM public.possible_backlinks where created_by = $1;`,
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
                    title: result.rows[0].title.trim(),
                    snippet: result.rows[0].snippet.trim()
                })
            });
            return contents;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getBacklinksByState(userId: number, state: string): Promise<Array<IBacklink>> {
        const getQuery = {
            name: 'get-backlinks-by-state',
            text:  `SELECT link, rel, state, created_by, account_user, account_user_pass, id, title, snippet FROM public.possible_backlinks where created_by = $1 and state = $2;`,
            values: [userId, state]
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
                    accountUser: row.account_user,
                    accountUserPass: row.account_user_pass,
                    createdBy: row.created_by,
                    title: result.rows[0].title.trim(),
                    snippet: result.rows[0].snippet.trim()
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
            text:  `SELECT link, rel, state, created_by, account_user, account_user_pass, id, title, snippet FROM public.possible_backlinks where id = $1;`,
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
                title: result.rows[0].title.trim(),
                snippet: result.rows[0].snippet.trim()
            }
            
            return _backlink;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getBacklinkByLink(link: string): Promise<IBacklink | false> {
        const getQuery = {
            name: 'get-backlink-by-link',
            text:  `SELECT link, rel, state, created_by, account_user, account_user_pass, id, title, snippet FROM public.possible_backlinks where link = $1;`,
            values: [link]
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
                title: result.rows[0].title.trim(),
                snippet: result.rows[0].snippet.trim()
            }
            
            return _backlink;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
}