import knex from '../database/connection';
import {Request, Response} from 'express'

class ItemsController{
    async index (request: Request, response: Response) {

        const items = await knex('items').select('*');
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://localhost:3333/uploads/${item.image}`,
            };
        });
        
        return response.json(serializedItems);
    }

    async deleteItems(request: Request, response: Response){
        
        const {id} = request.params;

        const trx = await knex.transaction();

        const item_id = Number(id);
    
        await trx('point_items').where('item_id', '=', item_id).del();
    
        await trx('items').where('id', '=', item_id).del();

        await trx.commit();

        return response.json('Item com id ' +id+ ' foi deletado com sucesso!');
    }
}

export default ItemsController;