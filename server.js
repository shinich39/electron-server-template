import http from 'http';
import path from 'path';
import fs from 'fs';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import debug from 'debug';
import indexRouter from './server/routes/index.js';
import usersRouter from './server/routes/users.js';

debug('server:server');

const run = function() {
  return new Promise(function(resolve, reject) {
    const port = normalizePort(process.env.PORT || '3000');
    const app = express();
    
    // ser port
    app.set('port', port);
    
    // view engine setup
    app.set('views', path.join(process.cwd(), 'server', 'views'));
    app.set('view engine', 'ejs');
    
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(process.cwd(), 'server', 'public')));
    
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      next(createError(404));
    });
    
    // error handler
    app.use(function(err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};
    
      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
    
    // create http server
    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    
    function normalizePort(val) {
      var port = parseInt(val, 10);
    
      if (isNaN(port)) {
        // named pipe
        return val;
      }
    
      if (port >= 0) {
        // port number
        return port;
      }
    
      return false;
    }
    
    function onError(error) {
      if (error.syscall !== 'listen') {
        reject(error);
      }
    
      const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    
      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          reject(error);
      }
    }
    
    function onListening() {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);

      resolve(addr);
    }
  });
}

export default {
  run: run
};