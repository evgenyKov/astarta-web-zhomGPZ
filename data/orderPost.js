const { sqlBase, execStoreProc } = require('../sql');

const orderPost = (req,res)	=> {
	const params =[];
	for (field in req.body)	{
		let val = req.body[field];
		let type = 'NVarChar';
		if ( field == 'openDate' || field == 'dogovorD' || field == 'doverDate')
			type = 'Date';
		if (field == 'clientId' || field == 'limit' || field == 'orderId')
			type = 'Int';
		if (field ==  'type')
			type = "Int"
		if (field ==  'price') {
			type = "Real"
			val = val.replace(',', '.');
		}	
		params.push([field , type , val]);
	}
	params.push(['operatorId' , 'Int', req.session.user_id]);
	execStoreProc(res, `${sqlBase}.UPD_Order`, params);
}		

module.exports = orderPost;
