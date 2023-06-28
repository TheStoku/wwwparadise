const express = require('express');
const sha256 = require('sha256');
const connection = require('../database');
const router = express.Router();

async function getInfo(username, password) {
	const results = await connection.promise().query('SELECT * FROM gaming_accounts WHERE name = ? AND password = ? LIMIT 1', [username, password], (err, results) => {
		if (err) throw err;
	});

	return results[0].length > 0 ? results[0][0] : false;
}

async function isNameRegistered(username) {
	const results = await connection.promise().query('SELECT `name` FROM gaming_accounts WHERE name = ? LIMIT 1', [username], (err, results) => {
		if (err) throw err;
	});

	return results[0].length > 0 ? true : false;
}

async function updateData(id, key, value) {
	await connection.promise().query('UPDATE gaming_accounts SET ' + key + ' = ? WHERE id = ?', [value, id], (err, results) => {
		if (err) throw err;
	});
	return;
}

function checkURL(url) {
	return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

async function saveSettings(req, res) {
	const username = req.session.username;
	const newUsername = req.body.username;
	const password = sha256(req.body.password);
	const avatarUrl = req.body.avatar_url;
	const newPassword = req.body.new_password;
	const newPassword2 = req.body.new_password_2;
	const data = await getInfo(username, password);
	let output = `Incorrect credentials.`;

	if (data) {
		// Change username
		if (newUsername.length > 4 && username != newUsername && !await isNameRegistered(newUsername)) {
			// Call mysql query
			await updateData(data.id, 'name', newUsername);
			// Update cookie
			req.session.username = newUsername;
			output = `Account data has been changed successfully!`;
		}

		if (avatarUrl.length > 0 && checkURL(avatarUrl)) {
			req.session.avatarUrl = avatarUrl || 'https://static.cashbacker.com/imgs/blank-avatar.png';
			await updateData(data.id, 'avatarUrl', avatarUrl);
		}

		if (newPassword.length >= 4 && newPassword == newPassword2) {
			if (password != data.password) {
				output = `Error: Incorrect password.`;
			} else {
				await updateData(data.id, 'password', sha256(newPassword));
				output = `Account data has been changed successfully!`;
			}
		} else {
			output = `Account data has been changed successfully! ${data.name}`;
		}
	}
	res.render('settings', {session: req.session, title: 'Home', result: output});
}

router.post('/save', async (req, res) => {
	try {
		await saveSettings(req, res);
	} catch (err) {
		res.status(500).end();
	}
});

router.get('/', function(req, res, next) {
	if (req.session.loggedin) {
		res.render('settings', {session: req.session, title: 'Home', content: `Welcome back ${req.session.username}!`});
	} else {
		res.redirect('/');
	}
});

module.exports = router;
