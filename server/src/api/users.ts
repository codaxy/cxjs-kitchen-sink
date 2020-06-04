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

function readRoles(user): any {
   user.user_role = {
      set: user.roles.map((r) => ({
         userId_role_id: {
            role_id: r.id,
            userId: user.id,
         },
      })),
   };
   delete user.roles;
   return user;
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
         include: {
            user_role: { include: { role: { select: { name: true } } } },
         },
      });

      let result: any = { ...data };
      result.roles = data.user_role.map((ur) => ({
         id: ur.role_id,
         name: ur.role.name,
      }));
      delete result.user_role;
      send(res, 200, cleanPassword(result));
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
      let data = readRoles({
         ...req.body,
         id: uuid(),
         created_time: new Date().toISOString(),
      });
      let user = await prisma.user.create({ data });
      send(res, 200, cleanPassword(user));
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
      let data = readRoles(req.body);
      console.log(data);
      let user = await prisma.user.update({
         where: {
            id: req.params.id,
         },
         data,
      });
      send(res, 200, cleanPassword(user));
   });
});
