import asyncio


import tornado.ioloop
import tornado.web
from motor import MotorClient
from tornado.platform.asyncio import AsyncIOMainLoop

import routes


async def make_app(loop):

    settings = dict(debug=True,
                    autoreload=True)
    settings['db'] = MotorClient("mongodb://localhost:27017")['nodeslinks']
    return tornado.web.Application(routes.routes,
                                   **settings)


if __name__ == "__main__":
    AsyncIOMainLoop().install()
    loop = asyncio.get_event_loop()
    app = loop.run_until_complete(make_app(loop))
    app.listen(9999)
    loop.run_forever()