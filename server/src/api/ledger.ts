import { PrismaClient } from '@prisma/client';
import { registerAPI } from './register';
import * as send from '@polka/send-type';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

registerAPI((server) => {
   server.get('/api/ledgers', async (req, res) => {
      let data = await prisma.ledger.findMany({
         orderBy: {
            year: 'desc',
         },
      });
      send(res, 200, data);
   });

   server.get('/api/ledgers/:id', async (req, res) => {
      let data = await prisma.ledger.findOne({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, data);
   });

   server.delete('/api/ledgers/:id', async (req, res) => {
      await prisma.ledger.delete({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, null);
   });

   server.post('/api/ledgers', async (req, res) => {
      let data = await prisma.ledger.create({
         data: {
            ...req.body,
            id: uuid(),
         },
      });
      send(res, 200, data);
   });

   server.put('/api/ledgers/:id', async (req, res) => {
      let data = await prisma.ledger.update({
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
