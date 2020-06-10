import {
   PrismaClient,
   ledger_accountCreateInput,
   ledger_accountUpdateWithWhereUniqueWithoutLedgerInput,
} from '@prisma/client';
import { registerAPI } from './register';
import * as send from '@polka/send-type';
import { v4 as uuid } from 'uuid';
import { arrayDiff } from '../util/arrayDiff';
import { renameField } from '../util/renameField';
import { removeField } from '../util/removeField';
import { transform } from '../util/transformer';

const prisma = new PrismaClient();

async function transformAccounts(ledger_id, body) {
   let oldAccounts = ledger_id ? await prisma.ledger_account.findMany({ where: { ledger_id } }) : [];
   let diff = arrayDiff(oldAccounts, body.accounts, (a) => a.id);

   console.log(diff);

   delete body.accounts;
   let create: ledger_accountCreateInput[] = diff.added.map((x) => ({ ...x, id: uuid() }));

   body.ledger_account = {
      create,
   };

   if (ledger_id) {
      let update: ledger_accountUpdateWithWhereUniqueWithoutLedgerInput[] = diff.changed.map((x) => ({
         data: x.after,
         where: {
            id: x.key,
         },
      }));

      body.ledger_account.update = update;
   }

   return body;
}

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
         include: {
            ledger_account: true,
         },
      });
      send(res, 200, transform(data, renameField('ledger_account', 'accounts'), removeField('ledger_id')));
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
      let body = await transformAccounts(null, req.body);
      let data = await prisma.ledger.create({
         data: {
            ...body,
            id: uuid(),
         },
      });
      send(res, 200, data);
   });

   server.put('/api/ledgers/:id', async (req, res) => {
      let { id } = req.params;
      let body = await transformAccounts(id, req.body);
      let data = await prisma.ledger.update({
         where: {
            id: id,
         },
         data: body,
      });
      send(res, 200, data);
   });
});
