const controller = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getMessages', mid.requiresLogin, controller.Message.getMessages);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controller.Account.login);

  // app.get('/signup', mid.requiresSecure, mid.requiresLogout, controller.Account.signupPage);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controller.Account.signup);

  app.get('/logout', mid.requiresLogin, controller.Account.logout);
  app.get('/maker', mid.requiresLogin, controller.Message.makerPage);
  app.post('/maker', mid.requiresLogin, controller.Message.makeMessage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controller.Account.loginPage);
  app.post('/deleteMessage', mid.requiresLogin, controller.Message.deleteMessage);
};

module.exports = router;
