const { sqlBase, querySQL } = require('../sql.js');

const addTalon = require('./_addTalon');

const talons = (req,res) => {
	const { taraId, avtoId } = req.query;
	const sort = req.query['sort'];

	let sortField = (sort && sort[0] && sort[0].field) || 'taraDate'; 
	if (sortField === 'voditel') {
		sortField = 'lastname'
	}
	
	if (sortField === 'avto') {
		sortField = 'nomer'
	}
	const sortDirection = (sort && sort[0] && sort[0].direction) || 'desc';
	let where = '';
	if (taraId) {
		where = ` WHERE taraId='${taraId}'`
	}
	if (avtoId)	
		where = ` WHERE avtoId='${avtoId}'`;
	
	var sqltext = `
		SELECT taraDate, clientName, edrpou, isFiz, targetPunct, orderType, firstName, lastName, middleName, avtoTypename, nomer, trailer, drivingPermit, atpname,
			tara, operatorname,orderTypename, taraId, IIF(limit IS NULL, 0, limit )  as limit, IIF(nettoSum IS NULL, 0, nettoSum )  as netto,
			IIF(orderN IS NULL, '', orderN )  as orderN, avtoId, nomerTTN
		FROM ${sqlBase}.OpenTalons_View 
		${where}
		ORDER BY ${sortField} ${sortDirection}`;
	var str = {
		list: [],
		err: ''
	};	
	
	querySQL(res, sqltext, str, 
		columns =>	addTalon(str.list, columns)	
	)
}

module.exports = talons;
