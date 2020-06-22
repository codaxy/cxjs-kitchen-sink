import {
   PrismaClient,
   ledger_accountCreateInput,
   ledger_accountUpdateWithWhereUniqueWithoutLedgerInput,
   ledger_accountWhereUniqueInput,
} from '@prisma/client';
import { registerAPI } from './register';
import * as send from '@polka/send-type';
import { v4 as uuid } from 'uuid';
import { arrayDiff } from '../util/arrayDiff';
import { DataTransformer } from '../util/DataTransformer';
import { parse as json2csv } from 'json2csv';
import * as neatCSV from 'neat-csv';
import * as Busboy from 'busboy';
import { uid } from '../util/uid';

const prisma = new PrismaClient();

let accountsTransformer = new DataTransformer().removeField('ledger_id');
let ledgerTransformer = new DataTransformer().renameField('ledger_account', 'accounts', accountsTransformer);

async function transformAccounts(ledger_id, body) {
   let oldAccounts = ledger_id ? await prisma.ledger_account.findMany({ where: { ledger_id } }) : [];
   let diff = arrayDiff(oldAccounts, body.accounts, (a) => a.id);

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

      let remove: ledger_accountWhereUniqueInput[] = diff.removed.map((x) => ({ id: x.id }));
      body.ledger_account.delete = remove;
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
      send(res, 200, ledgerTransformer.transform(data));
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

   server.get('/api/ledgers/:id/accounts/csv', async (req, res) => {
      let data = await prisma.ledger_account.findMany({
         where: {
            ledger_id: req.params.id,
         },
      });
      let accounts = new DataTransformer().removeField('ledger_id').transform(data);
      let body = json2csv(accounts, {
         fields: ['code', 'description', 'by_party', 'entries_allowed'],
      });
      send(res, 200, body, {
         'Content-Disposition': `attachment; filename="data.csv"`,
         'Content-Type': 'application/csv',
      });
   });

   server.post('/api/ledgers/:id/accounts/csv', async (req, res) => {
      let accounts = [];
      let files = [];
      await new Promise((resolve, reject) => {
         let busboy = new Busboy(req);
         busboy.on('file', (field, file, name, encoding, mime) => {
            const parse = async () => {
               let data = await neatCSV(file);
               accounts.push(...data);
            };
            files.push(parse());
         });
         busboy.on('finish', resolve);
         busboy.on('error', reject);
         req.pipe(busboy);
      });

      await Promise.all(files);

      await prisma.ledger_account.deleteMany({
         where: {
            ledger_id: req.params.id,
         },
      });

      await prisma.ledger.update({
         where: { id: req.params.id },
         data: {
            ledger_account: {
               create: accounts.map((acc) => ({
                  ...acc,
                  id: uid(),
                  by_party: Boolean(acc.by_party),
                  entries_allowed: Boolean(acc.entries_allowed),
               })),
            },
         },
      });

      send(res, 200, { success: true });
   });
});
