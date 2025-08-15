process.on('unhandledRejection', (err) => {
  throw err;
});

process.env.NODE_ENV = 'test';
