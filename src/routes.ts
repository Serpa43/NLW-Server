import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import multerConfig from './config/multer'
import multer from 'multer';
import {celebrate, Joi} from 'celebrate';


const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();
const upload = multer(multerConfig);


routes.get('/items', itemsController.index);
routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);
routes.delete('/points/:id', pointsController.deleteLines);
routes.put('/points/:id', pointsController.putLines);
routes.delete('/items/:id', itemsController.deleteItems);
routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
          name: Joi.string().required(),
          email: Joi.string().required().email(),
          whatsapp: Joi.number().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required(),
          city: Joi.string().required(),
          uf: Joi.string().required().max(2),
          items: Joi.string().required(),
        }),
      },
      {
        abortEarly: false
      }),
    
    pointsController.create,
  );

  export default routes;