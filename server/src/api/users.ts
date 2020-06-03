import { PrismaClient } from '@prisma/client';
import { registerAPI } from './register';
import * as send from '@polka/send-type';
import { v4 as uuid } from 'uuid';
import { compare as comparePassword, hash } from 'bcrypt';

const prisma = new PrismaClient();

function cleanPassword(user) {
   delete user.password_hash;
   return user;
}

function getOrderBy(params) {
   if (!params.sortField) return null;
   return {
      [params.sortField]: (params.sortDir || 'ASC').toLowerCase(),
   };
}

registerAPI((server) => {
   server.get('/api/users', async (req, res) => {
      let data = await prisma.user.findMany({
         orderBy: getOrderBy(req.query),
      });
      send(res, 200, data.map(cleanPassword));
   });

   server.get('/api/users/:id', async (req, res) => {
      let data = await prisma.user.findOne({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, cleanPassword(data));
   });

   server.delete('/api/users/:id', async (req, res) => {
      await prisma.user.delete({
         where: {
            id: req.params.id,
         },
      });
      send(res, 200, null);
   });

   server.post('/api/users', async (req, res) => {
      let data = await prisma.user.create({
         data: {
            ...req.body,
            id: uuid(),
            created_time: new Date().toISOString(),
         },
      });
      send(res, 200, cleanPassword(data));
   });

   server.post('/api/users/:id/password', async (req, res) => {
      let password_hash = await hash(req.body.password, 10);
      await prisma.user.update({
         where: {
            id: req.params.id,
         },
         data: {
            password_hash,
         },
      });
      send(res, 200, null);
   });

   server.put('/api/users/:id', async (req, res) => {
      let data = await prisma.user.update({
         where: {
            id: req.params.id,
         },
         data: {
            ...req.body,
         },
      });
      send(res, 200, cleanPassword(data));
   });
});
