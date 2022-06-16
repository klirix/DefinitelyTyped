// Type definitions for polka 0.5
// Project: https://github.com/lukeed/polka
// Definitions by: Piotr Kuczynski <https://github.com/pkuczynski>
//                 James Messinger <https://github.com/JamesMessinger>
//                 Brian Takita <https://github.com/btakita>
//                 Askhat Saiapov <https://github.com/klirix>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.7

/// <reference types="node" />

import { IncomingMessage, Server, ServerResponse } from "http";
import { ParsedUrlQuery } from "querystring";
import { ListenOptions } from "net";
import Trouter = require('trouter');

interface ParamsDictionary {
    [key: string]: string;
}

export interface RequestHandler<
    P extends ParamsDictionary = ParamsDictionary,
    ReqBody = any,
    ReqQuery = ParsedUrlQuery
    > {
    (req: Request<P, ReqBody, ReqQuery>, res: ServerResponse, next: Next): void;
}
/**
 * A middleware function
 */
export type Middleware<
    P extends ParamsDictionary = ParamsDictionary,
    ReqBody = any,
    ReqQuery = ParsedUrlQuery
    > = RequestHandler<P, ReqBody, ReqQuery>;

/**
 * Calls the next middleware function in the chain, or throws an error.
 */
type Next = (err?: string | Error) => void;

/**
 * An `http.IncomingMessage`, extended by Polka
 */
export interface Request<
    P extends ParamsDictionary = ParamsDictionary,
    ReqBody = any,
    ReqQuery = ParsedUrlQuery
    > extends IncomingMessage {
    /**
     * The originally-requested URL, including parent router segments.
     */
    originalUrl: string;

    /**
     * The path portion of the requested URL.
     */
    path: string;

    /**
     * The values of named parameters within your route pattern
     */
    params: P;

    /**
     * The un-parsed querystring
     */
    search: string | null;

    /**
     * The parsed querystring
     */
    query: ReqQuery;

    body: ReqBody;
}
interface ParsedUrl {
    search: string;
    query: string;
    pathname: string;
    path: string;
    href: string;
    _raw?: string;
}

/**
 * An instance of the Polka router.
 */
declare class Polka extends Trouter<RequestHandler> {
    /**
     * Parses the `req.url` property of the given request.
     */
    parse: (req: Request) => ParsedUrl | undefined;

    /**
     * Attach middleware(s) and/or sub-application(s) to the server.
     * These will execute before your routes' handlers.
     */
    use(...handlers: RequestHandler[]): this;

    /**
     * Attach middleware(s) and/or sub-application(s) to the server.
     * These will execute before your routes' handlers.
     */
    use(
        pattern: string | RegExp,
        ...handlers: RequestHandler[] | Polka[]
    ): this;

    /**
     * Boots (or creates) the underlying `http.Server` for the first time.
     * All arguments are passed to server.listen directly with no changes.
     */
    listen(
        port?: number,
        hostname?: string,
        backlog?: number,
        listeningListener?: () => void
    ): this;
    listen(
        port?: number,
        hostname?: string,
        listeningListener?: () => void
    ): this;
    listen(
        port?: number,
        backlog?: number,
        listeningListener?: () => void
    ): this;
    listen(port?: number, listeningListener?: () => void): this;
    listen(
        path: string,
        backlog?: number,
        listeningListener?: () => void
    ): this;
    listen(path: string, listeningListener?: () => void): this;
    listen(options: ListenOptions, listeningListener?: () => void): this;
    listen(handle: any, backlog?: number, listeningListener?: () => void): this;
    listen(handle: any, listeningListener?: () => void): this;

    /**
     * The main Polka `IncomingMessage` handler.
     * It receives all requests and tries to match the incoming URL against known routes.
     */
    handler(req: Request, res: ServerResponse, parsed?: ParsedUrl): void;

    /**
     * The instantiated `server` Polka creates when `listen()` is called.
     * `server` is only created if a server was not provided via `option.server`
     * `server` will be undefined until polka.listen is invoked or if a server was provided.
     */
    server?: Server | undefined;
}
type VerbHandler = <
    P extends ParamsDictionary = ParamsDictionary,
    ReqBody = any,
    ReqQuery = ParsedUrlQuery
    >(
    pattern: string | RegExp,
    ...handlers: RequestHandler<P, ReqBody, ReqQuery>[]
) => Polka;

/**
 * Polka options
 */
interface Options {
    /**
     * The server instance to use when `polka.listen()` is called.
     */
    server?: Server;

    /**
     * A catch-all error handler; executed whenever a middleware throws an error.
     */
    onError?(err: Error, req: Request, res: ServerResponse, next: Next): void;

    /**
     * A handler when no route definitions were matched.
     */
    onNoMatch?(req: Request, res: ServerResponse): void;
}

/**
 * Creates a Polka HTTP router.
 *
 * @see https://github.com/lukeed/polka
 */
export default function polka(opts?: Options): Polka;
