const express = require('express');
const connection = require('../database');
const router = express.Router();

const top = {
	kills: 0,
	deaths: 0,
	topSpree: 0,
	headshots: 0,
	xp: 0,
	joins: 0,
	jackedVehicles: 0,
	dodoFlightTime: 0,
	hiddenPackages: 0,
};

const TOP_LIMIT = 5;

async function loadTopScoresQuery(key) {
	const sql = 'SELECT `id`, `name`, `' + key + '` FROM `gaming_accounts` WHERE ' + key + ' > 0 ORDER BY ' + key + ' DESC LIMIT ' + TOP_LIMIT;
	const results = await connection.promise().query(sql);


	top[key] = results[0];

	if (top[key].length < TOP_LIMIT) {
		for (let index = top[key].length; index < TOP_LIMIT; index++) {
			top[key].push({name: 'Empty', [key]: '0'});
		}
	}
}

async function refreshTop() {
	await Object.keys(top).forEach((element) => {
		loadTopScoresQuery(element);
	});
}

refreshTop();

router.get('/', async function(req, res, next) {
	await refreshTop();

	res.render('top', {session: req.session, title: 'Top', topData: top});
});

module.exports = router;
