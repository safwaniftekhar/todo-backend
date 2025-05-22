const { io } = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZDJkN2NiNS1lYzFkLTRhMmYtOGE2Mi0yZGRlZTMwYmEwNTQiLCJlbWFpbCI6InVzZXJzYWRpQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ3OTM3MzY0LCJleHAiOjE3NDg1NDIxNjR9.qeIZoSktEYpZY1M09w_UXXfbbIsEUa6Xwa1UhHOcgf4', // if you're using JWT auth
  },
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO server');
});

socket.on('notification', (data) => {
  console.log('📬 Notification received:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
