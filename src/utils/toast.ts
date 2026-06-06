export type ToastType = 'error' | 'success' | 'info';

export interface ToastEntry {
  id: number;
  message: string;
  type: ToastType;
}

type Listener = (entry: ToastEntry) => void;

let _id = 0;
const _listeners = new Set<Listener>();

function _fire(message: string, type: ToastType) {
  const entry: ToastEntry = { id: ++_id, message, type };
  _listeners.forEach(fn => fn(entry));
}

export const toast = {
  error: (message: string) => _fire(message, 'error'),
  success: (message: string) => _fire(message, 'success'),
  info: (message: string) => _fire(message, 'info'),
  _subscribe(fn: Listener): () => void {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
};
