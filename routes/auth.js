const express = require('express');
const sha256 = require('sha256');
const connection = require('../database');
const config = require('config');
const router = express.Router();

const BAN_TIME = config.get('auth.banTime');
const MAX_FAILS = config.get('auth.maxFails');

async function hasFailedLogin(req, res) {
	const results = await connection.promise().query('SELECT * FROM failed_login WHERE ip = ? LIMIT 1', [req.ip], (err, results) => {
		if (err) throw err;
	});

	return results[0].length > 0 ? results[0][0] : false;
}

async function getData(username, password) {
	const results = await connection.promise().query('SELECT * FROM gaming_accounts WHERE name = ? AND password = ?', [username, password], (err, results) => {
		if (err) throw err;
	});

	return results[0].length > 0 ? results[0][0] : false;
}

async function isLoginLocked(req, res) {
	const hasFailed = await hasFailedLogin(req, res);
	const timeNow = Date.now() * 10000;

	console.table(hasFailed);

	if (hasFailed) {
		if (timeNow - hasFailed.timestamp < BAN_TIME * 1000) {
			console.log('fails++');
			hasFailed.fails++;
		} else {
			console.log('fails 1');
			hasFailed.fails = 1;
		}

		await connection.promise().query('UPDATE failed_login SET timestamp = ?, fails = ? WHERE id = ?', [timeNow, hasFailed.fails, hasFailed.id], (err, results) => {
			if (err) throw err;
		});
	} else {
		await connection.promise().query('INSERT INTO failed_login (ip, name, fails, timestamp) VALUES (?, ?, ?, ?)', [req.ip, req.body.username, 1, timeNow], (err, results) => {
			if (err) throw err;
		});
	}

	return hasFailed.fails > MAX_FAILS ? true : false;
}

async function loginRoute(req, res) {
	const username = req.body.username;
	const password = sha256(req.body.password);
	// const hasFailed = await checkFailedLogin(req, res);

	if (username && password) {
		const data = await getData(username, password);
		const isLocked = await isLoginLocked(req, res);

		// If the account exists and password matches.
		console.table(data);
		if (data && !isLocked) {
			// Authenticate the user
			req.session.loggedin = true;
			req.session.username = data.name;
			req.session.avatarUrl = data.avatarUrl || 'https://static.cashbacker.com/imgs/blank-avatar.png';
			// Redirect to home page
			res.redirect('/');
		} else {
			// let isLocked = await isLoginLocked(req, res);
			let output = '';

			if (isLocked) {
				output = 'Error: Too many incorrect login credentials. Account is locked.';
			} else {
				output = 'Error: Incorrect Username and/or Password!';
			}

			res.render('index', {session: req.session, title: 'Error', content: output});
		}
	}
}

router.post('/login', async (req, res) => {
	try {
		await loginRoute(req, res);
	} catch (err) {
		res.status(500).end();
	}
});

router.post('/logout', function(req, res, next) {
	req.session.loggedin = null;
	req.session.username = null;
	res.redirect('/');
});

module.exports = router;
