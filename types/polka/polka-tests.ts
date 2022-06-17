import { ServerResponse } from 'http';
import Polka, { Middleware, Next, Request, RequestHandler } from 'polka';

interface Body {
    foo: string;
}

const middleware: Middleware<any, Body, any> = async (req, res, next) => {
    const originalUrl = req.originalUrl;
    const path = req.path;

    res.end(JSON.stringify({ foo: 'bar' }));

    await new Promise<void>((resolve, reject) => resolve());
    next();
};

const aHandler: RequestHandler = (req, res) => {};

const routesA = Polka()
    .use(middleware)
    .get('/a', aHandler)
    .post('/b', (req, res) => {})
    .add('PUT', '/c', aHandler);

routesA.find('GET', '/a').handlers.includes(aHandler);

interface AuthedRequest extends Request {
    user?: string;
}

const authMiddleware =
    async (req: AuthedRequest, res: ServerResponse, next: Next) => {
    if (req.headers.authorization === 'hello') {
        req.user = 'hello';
        next();
    } else {
        next(new Error('Authentication'));
    }
};

const routesB = Polka()
    .use(authMiddleware)
    .get('/1', (req: AuthedRequest, res) => {
        app.server?.close();
    })
    .delete('/2', (req: AuthedRequest, res) => {
        console.log(req.user);
    });

const app = Polka()
    .use('/path-a', routesA)
    .use('/path-b', routesB);

app.listen(3000);

const short = Polka().get('/abc', () => {}).listen(3000);
