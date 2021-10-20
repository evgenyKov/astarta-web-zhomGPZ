const { sqlBase, execStoreProc1 } = require('../sql');

const ttnSplit = (req, res)	=> {
	const params = [];
	params.push(['ttn', 'Int', +req.query.ttn]);
	execStoreProc1(res, `${sqlBase}.ADMIN_AutoSplitTTN`, params);
}	

module.exports = ttnSplit;
