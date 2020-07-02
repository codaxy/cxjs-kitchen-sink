import { PrismaClient, user_roleCreateManyWithoutUserInput, user_roleUpdateManyWithoutUserInput } from '@prisma/client';
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

async function readRoles(user) {
   let role_ids = user.roles?.map((r) => r.id) ?? [];
   const user_id = user.id;
   if (user.id) {
      let dbroles = await prisma.user_role.findMany({
         where: {
            user_id,
         },
      });
      let op: user_roleUpdateManyWithoutUserInput = {
         delete: dbroles
            .filter((r) => !role_ids.includes(r.role_id))
            .map((r) => ({
               user_id_role_id: {
                  role_id: r.role_id,
                  user_id,
               },
            })),
         create: role_ids
            .filter((rid) => !dbroles.find((r) => r.role_id == rid))
            .map((role_id) => ({
               role: { connect: { id: role_id } },
            })),
      };
      user.user_role = op;
   } else {
      let op: user_roleCreateManyWithoutUserInput = {
         create: role_ids.map((role_id) => ({
            role: {
               connect: {
                  id: role_id,
               },
            },
         })),
      };
      user.user_role = op;
   }
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
      let data = await readRoles(req.body);
      let user = await prisma.user.create({
         data: {
            ...data,
            id: uuid(),
            created_time: new Date().toISOString(),
         },
      });
      send(res, 200, cleanPassword(user));
   });

   server.post('/api/users/:id', async (req, res) => {
      let data = await readRoles(req.body);
      let success = { msg : true };
      let user = await prisma.user.findOne({
         where: {
            email: data.email,
         }
      });
      if(!user) {
         if(req.params.id == 'new') {
            user = await prisma.user.create({
               data: {
                  ...data,
                  id: uuid(),
                  created_time: new Date().toISOString(),
               },
            });
         } else {
            user = await prisma.user.update({
               where: {
                  id: req.params.id,
               },
               data,
            });
         }
      } else {
         success = { msg : false };
      }
      // let user = await prisma.user.upsert({
      //    where: {
      //       email: req.params.email,
      //    },
      //    update: data,
      //    create: {
      //       ...data,
      //       id: uuid(),
      //       created_time: new Date().toISOString(),
      //    },
      // });
      send(res, 200, success);
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
});
