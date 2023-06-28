const express = require('express');
const connection = require('../database');
const router = express.Router();

async function getInfo(username) {
	const sqlSelect = 'id, name, avatarUrl, locale, registered, last_seen, joins, spawns, kills, deaths, suicides, headshots, warnings, xp, items, backpackSize, vehicles, properties, quests, infoPickups, sentMessages, topSpree, jackedVehicles, hiddenPackages, convoys,	dodoFlightTime,	onlineTime,	mileage';

	const results = await connection.promise().query('SELECT ' + sqlSelect + ' FROM gaming_accounts WHERE name=? LIMIT 1', [username], (err, results) => {
		if (err) throw err;
	});

	return results[0].length > 0 ? results[0][0] : false;
}

async function search(req, res) {
	const nickname = req.body.nickname ? req.body.nickname : req.params.name;

	if (nickname.length >= 4) {
		const player = await getInfo(nickname);

		if (player) {
			if (player.avatarUrl.length == 0) player.avatarUrl = 'https://static.cashbacker.com/imgs/blank-avatar.png';
			let date = new Date(player.last_seen * 1000);
			player.last_seen = date.toLocaleDateString('pl-PL') + ' ' + date.toLocaleTimeString('pl-PL');

			date = new Date(player.registered * 1000);
			player.registered = date.toLocaleDateString('pl-PL') + ' ' + date.toLocaleTimeString('pl-PL');

			res.render('search', {session: req.session, title: 'Search', result: 'Player ' + player.name, stats: player});
		} else {
			console.log('4');
			res.render('search', {session: req.session, title: 'Search', result: 'None'});
		}
	}
	res.render('search', {session: req.session, title: 'Search', result: 'error'});
}

router.post('/find', async (req, res) => {
	try {
		await search(req, res);
	} catch (err) {
		res.status(500).end();
	}
});
/*
router.get('/user/:name', async (req, res) => {
	try {
		await search(req, res);
	} catch (err) {
		res.status(500).end();
	}
});
*/
router.get('/', async (req, res) => {
	if (req.session.loggedin === true) {
		res.render('search', {session: req.session, title: 'Search'});
	} else {
		res.render('search', {title: 'Search'});
	}
});

module.exports = router;
