import { startNotificationHub, stopNotificationHub } from '../services/notification.service';
import { NotificationItem } from '../types/notification.types';

type Handler = (n: NotificationItem) => void;

const _handlers = new Set<Handler>();
let _running = false;

export const notificationHub = {
  subscribe(fn: Handler): () => void {
    _handlers.add(fn);
    return () => _handlers.delete(fn);
  },

  async start(): Promise<void> {
    if (_running) return;
    _running = true;
    try {
      await startNotificationHub(n => _handlers.forEach(h => h(n)));
    } catch {
      _running = false;
    }
  },

  async stop(): Promise<void> {
    _running = false;
    await stopNotificationHub();
  },

  get isRunning() {
    return _running;
  },
};
