import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController{

    async index(request:Request, response:Response){
        const {city, uf, items} = request.query;
        
        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
          .join('point_items', 'points.id', '=', 'point_items.point_id')
          .whereIn('point_items.item_id', parsedItems)
          .where('city', String(city))
          .where('uf', String(uf))
          .distinct()
          .select('points.*');

        return response.json(points);
    }

    async show(request:Request, response:Response){
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message: 'Point not found'});
        }

        const items = await knex('items')
         .join('point_items', 'items.id', '=', 'point_items.item_id')
         .where('point_items.point_id', id)
         .select('items.title');

        return response.json({point, items});
    }

    async create (request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            lat,
            lng,
            city,
            uf,
            items
        } = request.body;
        console.log(lat,lng);
    
        const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            lat,
            lng,
            city,
            uf
        };

        const trx = await knex.transaction();
    
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0]
    
        const pointItems = items.map((item_id: number) => {
            return{
                item_id,
                point_id,
            };
        });
    
        await trx('point_items').insert(pointItems);

        await trx.commit();
    
        return response.json({id:point_id, ...point, });
    }

    async deleteLines(request: Request, response: Response){

        const {id} = request.params;

        const trx = await knex.transaction();

        const point_id = Number(id);
    
        await trx('point_items').where('point_id', '=', point_id).del();
    
        await trx('points').where('id', '=', point_id).del();
    
        await trx.commit();
        
        
        return response.json('Coletadora com id ' +id+ ' foi deletada com sucesso!');
    }

    async putLines(request: Request, response: Response) {
        const {
          name,
          email,
          whatsapp,
          latitude,
          longitude,
          city,
          uf,
        } = request.body;
    
        const { id } = request.params;
    
        const trx = await knex.transaction();
    
        const point_infos = {
          image:
            'https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
          name,
          email,
          whatsapp,
          latitude,
          longitude,
          city,
          uf,
        };
    
        const point_id = Number(id);
    
        await trx('points').where('id', '=', point_id).update({
          image: point_infos.image,
          name: point_infos.name,
          email: point_infos.email,
          whatsapp: point_infos.whatsapp,
          latitude: point_infos.latitude,
          longitude: point_infos.longitude,
          city: point_infos.city,
          uf: point_infos.uf,
        });
    
        await trx.commit();
    
        return response.json({
          id: point_id,
          ...point_infos,
        });
      }
    
}

export default PointsController;