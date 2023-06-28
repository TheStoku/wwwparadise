const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const config = require('config');

const app = express();

app.locals.siteTitle = config.get('site.title');

const cookie = {
	name: config.get('cookie.name'),
	key: config.get('cookie.keys'),
	maxAge: config.get('cookie.maxAge'),
};

app.use(cookieSession({
	name: cookie.name,
	keys: [cookie.key['1'], cookie.key['2']],
	maxAge: cookie.maxAge, // 24 hours
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const indexRouter = require('./routes/index');
const statisticsRouter = require('./routes/statistics');
const searchRouter = require('./routes/search');
const topRouter = require('./routes/top');
const rulesRouter = require('./routes/rules');
const authRouter = require('./routes/auth');
const settingsRouter = require('./routes/settings');


app.use('/', indexRouter);
app.use('/statistics', statisticsRouter);
app.use('/', searchRouter);
app.use('/search', searchRouter);
app.use('/top', topRouter);
app.use('/rules', rulesRouter);
app.use('/', authRouter);
app.use('/', authRouter);
app.use('/', settingsRouter);
app.use('/settings', settingsRouter);

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

process.on('SIGTERM', () => {
	debug('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		debug('HTTP server closed');
	});
});

module.exports = app;
