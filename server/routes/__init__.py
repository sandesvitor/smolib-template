from aiohttp import web

app = web.Application()
routes = web.RouteTableDef()


@routes.get("/")
async def index(request):
    with open('index.html', 'r') as file:
        return web.Response(text=file.read(), content_type="text/html")
