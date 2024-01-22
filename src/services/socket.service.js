const socketIO = require('socket.io');

class SocketService {
  constructor() {
    this.io = null;
  }

  configureSocket(server) {
    this.io = socketIO(server);

    this.io.on('connection', (socket) => {
      console.log('New user connected');

      // Vous pouvez ajouter d'autres logiques de gestion des événements ici

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  getIo() {
    if (!this.io) {
      throw new Error('Socket.IO not initialized');
    }
    return this.io;
  }

  notifyDeliveryStatusChanged(deliveryId, newStatus) {
    const io = this.getIo();
    io.emit('status_changed', { event: 'status_changed', delivery_id: deliveryId, status: newStatus });
  }

  notifyDeliveryLocationChanged(deliveryId, newLocation) {
    const io = this.getIo();
    io.emit('location_changed', { event: 'location_changed', delivery_id: deliveryId, location: newLocation });
  }

  notifyDeliveryUpdated(delivery) {
    const io = this.getIo();
    io.broadcast.emit('delivery_updated', {
      event: 'delivery_updated',
      delivery: delivery 
    });
  
  }
}

const socketService = new SocketService();

module.exports = socketService;
