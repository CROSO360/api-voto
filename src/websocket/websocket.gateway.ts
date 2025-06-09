import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/',
  path: '/api/socket.io',
  cors: {
    origin: [process.env.VOTACION_OCS_URL, process.env.VOTO_MOVIL_OCS_URL],
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Método para emitir eventos a los clientes
  emitChange(puntoUsuarioId: number) {
    this.server.emit('change', { puntoUsuarioId });
  }
}
