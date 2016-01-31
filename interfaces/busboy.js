declare module "busboy" {

  declare class exports {
    constructor(options: Object) : void;
    on(event: string, handler: Function) : this;
    removeAllListeners(event: string) : void;
  }
}
