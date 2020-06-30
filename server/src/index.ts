import { json } from 'body-parser';
import * as polka from 'polka';
import './api';
import { registerServer } from './api/register';

let server = polka();

let port = process.env.PORT || 3000;

server.use(json());

registerServer(server);

server.listen(port, (err) => {
   if (err) throw err;
   console.log(`> Running on localhost:${port}`);
});
