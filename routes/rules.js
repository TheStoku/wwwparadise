const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
	if (req.session.loggedin === true) {
		res.render('rules', {session: req.session, title: 'Rules'});
	} else {
		res.render('rules', {title: 'Rules'});
	}
});

module.exports = router;
