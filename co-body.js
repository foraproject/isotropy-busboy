declare module "co-body" {
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

    declare function exports(context: KoaContextType) : Promise<Object>
}
