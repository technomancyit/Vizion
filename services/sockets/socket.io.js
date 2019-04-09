'use strict';

const fs = require('fs'),
    path = require('path'),
    camelCase = require('camelcase'),
    dir = __dirname;


let socketRoutesJs = path.join(`${dir}`, '../express/public/js', 'socketRoutes.js');

module.exports = class Sockets {

    constructor(http, obj) {
        this.io = require('socket.io')(http);
        this.socketClients = {};
        //   this.to = obj.to;
        //   this.subject = obj.subject;
        //   this.text = obj.text;
        //   this.html = obj.html;
        //   this.attachments = obj.attachments;
    }

    async eraseRoutes() {
        await fs.writeFile(socketRoutesJs, '');
    }

    async eraseRoutes() {
        await fs.writeFile(socketRoutesJs, '');
    }


    async socketRoute(script) {
        this.io.on('connection', (socket) => {
            this[script](socket);
        });
    }

    async connect(socket) {
        let socketClients = this.socketClients;
        socketClients[socket.id] = {
            connected: true,
            rooms: {}
        }
        this.socket = socket;
        console.log('a user connected');
    }

    async disconnect(socket) {
        let socketClients = this.socketClients;

        socket.on('disconnect', () => {
            console.log('as', socketClients[socket.id])
            delete socketClients[socket.id];
        });
        console.log('a user disconnected');
    }

    async joinRoom(socket, options) {

        if (options.leaveLastRoom) {
            let lastRoom = this.socketClients[socket.id].lastRoom;
            socket.leave(lastRoom);
            delete this.socketClients[socket.id].rooms[lastRoom];
            this.socketClients[socket.id].lastRoom = options.room;
        }


        socket.join(options.room, () => {
            let rooms = Object.keys(socket.rooms);
            console.log(rooms); // [ <socket.id>, 'room 237' ]
        });





        this.socketClients[socket.id].rooms[options.room] = {
            joined: true
        }
    }

    async leaveRoom(socket, options) {

        socket.leave(options.room);
        delete this.socketClients[socket.id].rooms[options.room];

    }

    async broadcast(socket, options, data) {

        // socket.broadcast.in(page).emit(script, data);
       
        if(typeof socket === 'string') socket = this.io.sockets.connected[socket];

        
        let type = options.type ? options.type : 'in';

        if(type === 'in') {

            this.io[type](options.room).emit(options.script, data);
        } else {
            socket.broadcast[type](options.room).emit(options.script, data);
        }

        // this.io.in('5c85bb2357ebf780410768c3').emit('joinRoom', 'the game will start soon');

        //  socket.to(page).emit(script, "let's play a game");
        //    this.io.in(page).emit(script, data);
        // socket.emit(script, data);
    }

    async socketOn(name, options) {
        this.io.on('connection', (socket) => {
            
            let socketClients = this.socketClients;
            socket.on(name, (data) => {
                if (data.room && data.action === 'join') {
                    this.joinRoom(socket, data);
                    return;
                }

                if (data.room && data.action === 'leave') {
                    this.leaveRoom(socket, data);
                    return;
                }

                if (data.room && data.action === 'send') {
                    this.broadcast(socket, {room:data.room, script:'socketPush', type:'to'}, data.body);
                    return;
                }

                socket.emit(name, data);

            });
        });

        if (!options || !options.noClient) await this.clientLoad(name, options);
    }


    async clientLoad(name, options) {
        options = options ? options : {};
        let subname = options.subname ? options.subname : '';



        if (!this.socketRoutesStream) {

            this.socketRoutesStream = await fs.createWriteStream(socketRoutesJs, {
                'flags': 'a'
            });
        }

        this.socketRoutesStream.write(`socket.on('${name}', function (obj, options) {
                
                socketInterpreter(obj, options);
            });
    
            function ${camelCase(`socket-${subname}-${name}`)}(obj) {
                socket.emit('${name}', obj);
              }`);

    }
    async streamClose() {
        this.socketRoutesStream.end('');
    }
}
