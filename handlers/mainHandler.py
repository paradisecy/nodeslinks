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
        ldf = pd.read_csv(StringIO(rL), sep=",", header=None)

        cols = [str(x + 1) for x in range(len(ldf.index))]
        ldf.columns = cols

        dag_nodes = [{'id': x + 1, 'label': x + 1} for x in range(len(ldf.index))]
        dag_links = []

        for index, row in ldf.iterrows():
            for name, val in row.iteritems():
                if val == 1:
                    dag_links.append({
                        'id': f"a{str((index + 1))}{name}",
                        'source': str(index + 1),
                        'target': name})

        await self.finish({"dag": {'nodes': dag_nodes,
                                   'links': dag_links}})


class UploadHandler(BaseHandler):
    async def post(self):
        file = self.request.files['fileUp'][0]
        mode = self.request.files['mode'][0]['filename']
        original_name = file['filename']

        db = self.settings['db']
        document = {'body': file['body'], 'name': original_name}
        await db[mode].insert_one(document)

        await self.finish({"return": "ok"})
