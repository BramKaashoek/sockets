const Koa = require('koa');
const Router = require('koa-router');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
const router = new Router();
const server = new http.Server(app.callback());
const io = socketIo(server);

const counters = [];

io.on('connect', socket => {
  console.log('socket connected');
  socket.on('disconnect', () => {
    console.log('socket disconnected');
  });
});

router.get('/', ctx => {
  ctx.body = 'post to /counter';
});

const updateCounter = id => {
  const index = counters.findIndex(counters => counters.id === id);
  const counter = { ...counters[index] };
  counter.count += 1;
  counters[index] = counter;
  io.emit(counter.id, counter);
};

router.get('/counters/:id', ctx => {
  const { id } = ctx.params;
  if (!counters.some(counter => counter.id === id)) {
    const counter = { id, count: 0 };
    counters.push(counter);
    setInterval(updateCounter, 1000, id);
    ctx.body = counter;
  }

  const counter = counters.find(counter => counter.id === id);
  ctx.body = counter;
});

app.use(router.routes()).use(router.allowedMethods());

server.listen(3100);
