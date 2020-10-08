import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
import express from 'express';

export const usuariosConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket, io: socketIO.Server) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );
}

export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {
    
    cliente.on('disconnect', ( usuario) => {
        console.log('Cliente desconectado');
        usuariosConectados.borrarUsuario( cliente.id );
        io.emit('usuarios-activos', usuariosConectados.getLista() );
    });

    
}

//Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('mensaje', ( payload: { de:string, cuerpo:string}) => {
        io.emit('mensaje-nuevo', payload );
    });
}

//configurar usaurio
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('configurar-usuario', ( payload: { nombre:string }, callback: Function) => {
        
        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos', usuariosConectados.getLista() );
        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        })
    });
} 

//Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {
    cliente.on('obtener-usuarios', ( payload: { nombre:string }, callback: Function) => {
        io.to(cliente.id).emit('usuarios-activos', usuariosConectados.getLista());
    });
} 









