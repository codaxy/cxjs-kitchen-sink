import { PrismaClient } from '@prisma/client';
import { registerAPI } from './register';
import * as send from '@polka/send-type';
import { uid } from '../util/uid';

const prisma = new PrismaClient();

registerAPI((server) => {
   server.get('/api/parties', async (req, res) => {
      let data = await prisma.party.findMany();
      send(res, 200, data);
   });

   server.get('/api/parties/:id', async (req, res) => {
      let data = await prisma.party.findOne({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, data);
   });

   server.delete('/api/parties/:id', async (req, res) => {
      await prisma.party.delete({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, null);
   });

   server.post('/api/parties', async (req, res) => {
      let data = await prisma.party.create({
         data: {
            ...req.body,
            id: uid(),
         },
      });
      send(res, 200, data);
   });

   server.put('/api/parties/:id', async (req, res) => {
      let data = await prisma.party.update({
         where: {
            id: req.params.id,
         },
         data: {
            ...req.body,
         },
      });
      send(res, 200, data);
   });
});
