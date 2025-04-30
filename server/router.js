const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getJobs', mid.requiresLogin, controllers.Job.getJobs);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Job.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Job.makeJob);

  app.post('/updateStatus', mid.requiresLogin, controllers.Job.updateStatus);

  app.post('/updateNotes', mid.requiresLogin, controllers.Job.updateNotes);

  app.delete('/deleteJob', mid.requiresLogin, controllers.Job.deleteJob);

  app.get('/accountInfo', mid.requiresLogin, controllers.Account.accountInfo);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
