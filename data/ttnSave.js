const { sqlBase, execStoreProc1 } = require('../sql');

const ttnSave = (req, res) => {
	const params = [];
	params.push(['ttn' , 'Int' , req.body.ttn]);
	params.push(['brutto' , 'Int' , req.body.brutto]);
	params.push(['tara' , 'Int' , req.body.tara]);
	params.push(['type' , 'Int' , req.body.type]);
	params.push(['client' , 'Int' , req.body.client]);
	params.push(['order' , 'Int' , req.body.order]);
	params.push(['date' , 'Date' , req.body.date]);	
	execStoreProc1(res, `${sqlBase}.ADMIN_changeBrutto`, params);	
}

module.exports = ttnSave;
