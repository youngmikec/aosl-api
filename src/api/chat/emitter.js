// Holds the Socket.IO server so REST handlers can push the same real-time events the socket handlers do.
let io = null;

export const setIo = (server) => {
  io = server;
};

export const getIo = () => io;

// `exceptSocketId` keeps the originating socket from receiving its own event (it gets an acknowledgement instead).
export function publish(channels, event, payload, exceptSocketId) {
  if (!io || !channels || channels.length === 0) return;
  let target = io.to(channels);
  if (exceptSocketId) target = target.except(exceptSocketId);
  target.emit(event, payload);
}
