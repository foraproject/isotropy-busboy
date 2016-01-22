/* @flow */
export type IncomingMessage = {
  removeListener: (name: string) => void;
  removeAllListeners: (name: string) => void;
  on: (name: string, fn: Function) => void;
  pipe: (dest: any) => void;
  headers: Object;
}

export type ServerResponse = {
  removeListener: (name: string) => void;
  removeAllListeners: (name: string) => void;
  on: (name: string, fn: Function) => void;
  pipe: (dest: any) => void;
}
