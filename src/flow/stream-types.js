/* @flow */
export type Stream = {
  on: (name: string, fn: Function) => void;
  pipe: (dest: any) => void;
}
