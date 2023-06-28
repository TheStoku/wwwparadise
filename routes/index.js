const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	if (req.session.loggedin === true) {
		res.render('index', {session: req.session, title: 'Home', content: `Welcome back ${req.session.username}!`});
	} else {
		res.render('index', {session: req.session, title: 'Home', content: 'Welcome! This website is currently under development.'});
	}
});

module.exports = router;
