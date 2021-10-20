const { sqlBase, execStoreProc } = require('../sql');

const moveTTN = (req,res) => {
    const { id, ttns } = req.query;
	const params = [];	
	params.push(['id' , 'VarChar' , id]);
	params.push(['ttns' , 'VarChar' , '(' + ttns + ')']);
	execStoreProc(res, `${sqlBase}.ADMIN_ChangeTaraOrders`, params);		
}

module.exports = moveTTN;
