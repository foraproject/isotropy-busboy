/* @flow */
import type { IncomingMessage, ServerResponse } from "./http-types";

export type KoaType = {
    use: (middleware: KoaMiddlewareType) => void;
    middleware: Array<KoaMiddlewareType>
}

export type KoaNextType = () => Promise

export type KoaContextType = {
    code: number;
    redirect: (url: string) => void;
    method: string;
    path: string;
    status: number;
    body: string;
    request: Object,
    response: Object,
    req: IncomingMessage,
    res: ServerResponse
}

export type KoaMiddlewareType = (context: KoaContextType, next: KoaNextType) => Promise

export type KoaHandlerType = (context: KoaContextType, args: any) => Promise;
