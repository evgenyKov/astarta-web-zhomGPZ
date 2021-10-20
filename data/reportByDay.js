const { sqlBase, execStoreProc1 } = require('../sql');

const reportByDay = (req, res) => {
	const params = [];
	console.log("req.query.day", day);
	execStoreProc1(res, `${sqlBase}.GET_DayReport`, params);
}

module.exports = reportByDay;
