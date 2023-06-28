const express = require('express');
const connection = require('../database');
const router = express.Router();

// Load initial data on start.
let serverData = getInfo();

let chart = {
	timestamp: [],
	totalEarning: [],
	totalXp: [],
	totalJoins: [],
	totalKills: [],
	totalDeaths: [],
	totalSuicides: [],
	totalJacks: [],
	collectedPackages: [],
	collectedInfoPickups: [],
	completedQuests: [],
	completedAchievements: [],
	completedConvoys: [],
};

async function getInfo() {
	const sql = 'SELECT * FROM iii_data ORDER BY id DESC LIMIT 7';
	const results = await connection.promise().query(sql);

	chart = {
		timestamp: [],
		totalEarning: [],
		totalXp: [],
		totalJoins: [],
		totalKills: [],
		totalDeaths: [],
		totalSuicides: [],
		totalJacks: [],
		collectedPackages: [],
		collectedInfoPickups: [],
		completedQuests: [],
		completedAchievements: [],
		completedConvoys: [],
	};

	results[0].forEach((element) => {
		chart.timestamp.push(new Date(Number(element.timestamp*1000)).toDateString());
		chart.totalEarning.push(element.totalEarning);
		chart.totalXp.push(element.totalXp);
		chart.totalJoins.push(element.totalJoins);
		chart.totalKills.push(element.totalKills);
		chart.totalDeaths.push(element.totalDeaths);
		chart.totalSuicides.push(element.totalSuicides);
		chart.totalJacks.push(element.totalJacks);
		chart.collectedPackages.push(element.collectedPackages);
		chart.collectedInfoPickups.push(element.collectedInfoPickups);
		chart.completedQuests.push(element.completedQuests);
		chart.completedAchievements.push(element.completedAchievements);
		chart.completedConvoys.push(element.completedConvoys);
	});

	return results[0];
}

router.get('/', async function(req, res, next) {
	serverData = await getInfo();

	console.table(serverData);

	res.render('global', {
		session: req.session,
		title: 'Statistics',
		content: 'Global server statistics.',
		stats: serverData[0],
		chartData: encodeURIComponent(JSON.stringify(chart)),
	});
});

module.exports = router;
