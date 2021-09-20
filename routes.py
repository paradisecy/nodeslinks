from handlers.mainHandler import MainHandler, UploadHandler

routes = [
    (r"/api/main", MainHandler),
    (r"/api/upload", UploadHandler),

]