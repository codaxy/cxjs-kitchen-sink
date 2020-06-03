import * as polka from 'polka';
import { PrismaClient } from '@prisma/client';
import { registerServer } from './api/register';
import './api';
import { json } from 'body-parser';

let server = polka();

server
   .use(json())
   .get('/', async (req, res) => {
      let response = await fetch('http://localhost:8765/', {});
      let text = await response.text();
      res.end(text);
   })
   .get('/users/:id', async (req, res) => {
      const prisma = new PrismaClient();
      res.end(`User: ${req.params.id}`);
   });

registerServer(server);

server.listen(3000, (err) => {
   if (err) throw err;
   console.log(`> Running on localhost:3000`);
});
