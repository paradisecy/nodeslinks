from datetime import datetime
import json
import pandas as pd
from io import StringIO

from handlers.baseHandler import BaseHandler


class MainHandler(BaseHandler):
    async def get(self):
        db = self.settings['db']
        data = await db['cache'].find_one()
        ret = data['dag'] if data else {'nodes': [], 'links': [], 'tasks': [], 'dep': []}
        await self.finish(json.dumps(ret, indent=4, sort_keys=True, default=str))


class UploadHandler(BaseHandler):
    async def post(self):
        file = self.request.files['fileUp'][0]
        mode = self.request.files['mode'][0]['filename']
        original_name = file['filename']

        db = self.settings['db']
        document = {'body': file['body'], 'name': original_name}
        await db[mode].insert_one(document)

        # cache
        nodes = None
        links = None

        nCursor = db['nodes'].find().sort('_id', -1).limit(1)
        async for document in nCursor:
            nodes = document

        lCursor = db['links'].find().sort('_id', -1).limit(1)
        async for document in lCursor:
            links = document

        if nodes and links:
            rN = nodes['body'].decode('utf-8')
            rL = links['body'].decode('utf-8')

            ndf = pd.read_csv(StringIO(rN), sep=",")
            ldf = pd.read_csv(StringIO(rL), sep=",", header=None)

            cols = [str(x + 1) for x in range(len(ldf.index))]
            ldf.columns = cols

            dag_nodes = [{'id': x + 1, 'label': x + 1} for x in range(len(ldf.index))]
            dag_links = []

            tasks = [{'id': x['NodeId'], 'title': x['NodeId'], 'parentId': 0, 'progress': 0,
                      'start': datetime.strptime(x['StartDate'], '%d/%m/%Y'),
                      'end': datetime.strptime(x['EndDate'], '%d/%m/%Y')} for _, x in ndf.T.iteritems()]

            tasks = pd.DataFrame(tasks).sort_values(by="start").to_dict(orient='records')

            deps = []

            for index, row in ldf.iterrows():
                for name, val in row.iteritems():
                    if val == 1:
                        dag_links.append({
                            'id': f"a{str((index + 1))}{name}",
                            'source': str(index + 1),
                            'target': name})
                        deps.append({
                                'id': f"a{str((index + 1))}{name}",
                                'predecessorId': str(index + 1),
                                'successorId': name,
                                'type': 0
                            })

            await db.drop_collection('cache')
            await db['cache'].insert_one({"dag": {'nodes': dag_nodes,
                                                  'links': dag_links,
                                                  'tasks': tasks,
                                                  'dep': deps
                                                  }})

        await self.finish({"return": "ok"})
