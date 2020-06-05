import * as send from '@polka/send-type';

const callbacks = [];

export function registerAPI(registerCallback) {
   callbacks.push(registerCallback);
}

export function registerServer(server) {
   callbacks.forEach((register) =>
      register({
         get: (url, handler) => server.get(url, catchAll(handler)),
         post: (url, handler) => server.post(url, catchAll(handler)),
         put: (url, handler) => server.put(url, catchAll(handler)),
         delete: (url, handler) => server.delete(url, catchAll(handler)),
      })
   );
}

export const catchAll = (fn) => async (req, res) => {
   try {
      return await Promise.resolve(fn(req, res));
   } catch (err) {
      console.log(err);
      send(res, err.statusCode || 500, { error: err.statusMessage || err.message });
   }
};
