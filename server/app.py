from services import Room
from routes import web, app, routes
import socketio
import json

io = socketio.AsyncServer(cors_allowed_origins=[])
io.attach(app)

socket_status = -1


@io.event
async def connect(sid, environ):
    global socket_status

    print(f"[io.on('connect') - new socket [{sid}]")

    socket_status = Room.add_player_to_room(sid)

    await io.emit('whoAmI', Room.get_player_position(sid), room=sid)
    await io.emit('roomData', Room.get_room_data())


@io.on("selectCell")
async def handle_selected_cell(sid, data):
    render_cell_data = Room.handle_turn_results(data)

    await io.emit("roomData", Room.get_room_data())
    await io.emit("fillCell", render_cell_data)


@io.event
async def disconnect(sid):
    print(f"[io.on('disconnect') - socket [{sid}] disconnected ")

    await io.emit(Room.get_room_data())


app.add_routes(routes)


if __name__ == "__main__":
    web.run_app(app, port=5000)
