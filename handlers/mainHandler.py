import json
import pandas as pd
from io import StringIO
from handlers.baseHandler import BaseHandler


class MainHandler(BaseHandler):
    async def get(self):
        nodes = None
        links = None
        db = self.settings['db']

        nCursor = db['nodes'].find().sort('_id', -1).limit(1)
        async for document in nCursor:
            nodes = document

        lCursor = db['links'].find().sort('_id', -1).limit(1)
        async for document in lCursor:
            links = document

        rN = nodes['body'].decode('utf-8')
        rL = links['body'].decode('utf-8')

        ndf = pd.read_csv(StringIO(rN), sep=",")
        ldf = pd.read_csv(StringIO(rL), sep=",")


        await self.write(json.dumps({"message": "Hello Tornados"}))


class UploadHandler(BaseHandler):
    async def post(self):
        file = self.request.files['fileUp'][0]
        mode = self.request.files['mode'][0]['filename']
        original_name = file['filename']

        db = self.settings['db']
        document = {'body': file['body'], 'name': original_name}
        await db[mode].insert_one(document)

        await self.finish({"return": "ok"})
