const { sqlBase, execStoreProc } = require('../sql');

const orderClose = (req,res) => {
    const { id, date, reason } = req.query;
	const params = 
	[
		['id', 'Int', id],
		['date', 'Date', date],
		['reason', 'Int' , reason],
	];
	execStoreProc(res, `${sqlBase}.CLOSE_order`, params);
}	

module.exports = orderClose;
