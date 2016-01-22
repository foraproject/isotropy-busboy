declare module "busboy" {
  declare type KoaContextType = {
    code: number;
    redirect: (url: string) => void;
    method: string;
    path: string;
    status: number;
    body: string;
    request: Object,
    response: Object,
    req: Object,
    res: Object
  }

  declare type FilePartType = {
    fieldname: string;
    file: string;
    filename: string;
  };

  declare function exports(context: KoaContextType) : Promise<{ fields: { [key: string]: string }, files: Array<FilePartType> }>
}
