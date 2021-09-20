import tornado.web
from tornado.httpclient import AsyncHTTPClient

class BaseHandler(tornado.web.RequestHandler):

    @property
    def http(self):
        return AsyncHTTPClient()

    def set_default_headers(self):
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS')