const { execStoreProc1, sqlBase } = require('../sql')

const talonRemove = (req, res) => {
	const { ttn, safe } = req.query;
	const params = [];
	params.push(['ttn', 'Int', +ttn]);
	const procName = safe ? 'DEL_Tara_ByOperator' : 'DEL_Tara';
	execStoreProc1(res, `${sqlBase}.${procName}`, params);
}

module.exports = talonRemove;
