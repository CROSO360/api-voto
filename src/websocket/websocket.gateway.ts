// =============================================================
// WebsocketGateway
// Maneja conexiones WebSocket y emite eventos de actualización
// =============================================================

import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/', // Se usa el espacio raíz
  path: '/socket.io', // Path personalizado para integrarse con NGINX
  cors: {
    origin: [
      process.env.VOTACION_OCS_URL,     // Frontend escritorio
      process.env.VOTO_MOVIL_OCS_URL,   // Frontend móvil
    ],
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Cliente se conecta
  handleConnection(client: Socket): void {
    console.log(`Cliente conectado: ${client.id}`);
  }

  // Cliente se desconecta
  handleDisconnect(client: Socket): void {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Emitir evento 'change' a todos los clientes conectados
  emitChange(puntoUsuarioId: number): void {
    this.server.emit('change', { puntoUsuarioId });
  }
}
