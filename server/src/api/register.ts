const callbacks = [];

export function registerAPI(registerCallback) {
  callbacks.push(registerCallback);
}

export function registerServer(server) {
  callbacks.forEach((c) => c(server));
}
