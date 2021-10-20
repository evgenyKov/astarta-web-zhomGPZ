const { sqlBase, querySQL } = require('../sql');
const addTTN = require('./_addTTN');

const bruttoList = (req,res)	=> {	
	let where = '';
	const { date, ttn, to, from, sort } = req.query;

	let sortField = (sort && sort[0] && sort[0].field) || 'bruttoId'; 
	if (sortField === 'voditel') {
		sortField = 'avtoLastName'
	}
	if (sortField === 'avto') {
		sortField = 'avtoNomer'
	}

	const sortDirection = (sort && sort[0] && sort[0].direction) || 'desc';

	if (date) {
		where = ` WHERE ttnDate='${date}'`
	} else if (ttn){	
		where = ` WHERE nomerTTN='${ttn}'`
	} else {
		const queries = [];
		if (to)	{
			queries.push(`(bruttoDate<='${to}')`);
		}
		if (from)	{
			queries.push(`(bruttoDate>='${from}')`);
		}
		if (queries.length > 0) {
			where = ` WHERE ${queries.join(' AND ')}`;
		}
	}
	const sqltext= `
		SELECT bruttoId, bruttoDate, brutto, netto, bruttoOperatorName, taraId, tara, taradate, taraOperatorName,
			clientId, clientName, clientEdrpou, clientTargetPunct, clientIsFiz, orderId, orderDogovorN, orderDogovorD,
			orderDover, orderFio, limit, openDate, orderN, orderType,orderTypeName, avtoAtpName, avtoTypeName, avtoDrivingPermit, 
			avtoFirstName, avtoMiddleName, avtoLastName, avtoNomer, avtoTrailer, type, price, summa, koef, pereschet, 
			zachet, orderDoverDate, orderDoverSource, nomerTTN, clientFullName, prostoy, zhomTypeName,
			width, hight, len, atpEdrpou
		FROM ${sqlBase}.BruttoExt_View 
		${where}
		ORDER BY ${sortField} ${sortDirection}`;
	const str = {
		list: [],
		err: ''
	}
	querySQL(res, sqltext, str, 
		columns => addTTN(str.list, columns)	
	)	
}

module.exports = bruttoList;
