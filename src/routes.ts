import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';


const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();



routes.get('/items', itemsController.index);
routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);
routes.post('/points', pointsController.create);
routes.delete('/points/:id', pointsController.deleteLines);
routes.put('/points/:id', pointsController.putLines);
routes.delete('/items/:id', itemsController.deleteItems)


export default routes;