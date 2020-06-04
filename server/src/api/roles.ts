import { PrismaClient } from '@prisma/client';
import { registerAPI } from './register';
import * as send from '@polka/send-type';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

registerAPI((server) => {
   server.get('/api/roles', async (req, res) => {
      let data = await prisma.role.findMany();
      send(res, 200, data);
   });

   server.get('/api/roles/:id', async (req, res) => {
      let data = await prisma.role.findOne({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, data);
   });

   server.delete('/api/roles/:id', async (req, res) => {
      await prisma.role.delete({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, null);
   });

   server.post('/api/roles', async (req, res) => {
      let data = await prisma.role.create({
         data: {
            ...req.body,
            permissions: { set: req.body.permissions },
            id: uuid(),
         },
      });
      send(res, 200, data);
   });

   server.put('/api/roles/:id', async (req, res) => {
      let data = await prisma.role.update({
         where: {
            id: req.params.id,
         },
         data: {
            ...req.body,
            permissions: { set: req.body.permissions },
         },
      });
      send(res, 200, data);
   });
});
