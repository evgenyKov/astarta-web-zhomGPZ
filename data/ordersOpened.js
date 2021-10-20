const { querySQL, createBetweenStr, safeTrim, sqlBase } = require("../sql.js");

const createOrdersSQLQuery = query => {	
	const { sort, orderId, type, client, from, to } = query;
	const sortField = (sort)? sort[0].field : 'dateOpen';
	const sortDirection = (sort)? sort[0].direction : 'asc';
	
	let where = '';
	if (orderId) {
		where = `WHERE orderId=${orderId}`
	} else {
		const queries		=	[];
		if (type) {
			queries.push(`type=${type}`);
		}
		if (client) {
			queries.push(`clientId=${client}`);
		}
		if (from || to)
			queries.push(`( dateOpen ${createBetweenStr(from, to)} )`);
		if (queries.length > 0) {
			where =  `WHERE ${queries.join(' AND ')}`; 
		}
	}
		
	return `SELECT 
		clientname, EDRPOU, clientId, dateOpen, typenames, dogovorN, dogovorDate, dover, fio, orderN, limit, type, orderId,
		IIF(nettoSum IS NULL, 0, nettoSum )  as netto, IIF(zachetSum IS NULL, 0, zachetSum )  as zachet, doverDate, doverSource, namess AS typenamess,
		IIF(type=0, limit - IIF(zachetSum IS NULL, 0, zachetSum), limit-IIF(nettoSum IS NULL, 0, nettosum)) as rest, clientIsFiz
	FROM ${sqlBase}.OpenOrders_View 
	${where}
	ORDER BY ${sortField === 'clientnameRef' ? 'clientname': sortField} ${sortDirection}` ;
}

const addOrder = (out, columns) => {
	const order = {
		clientname:	safeTrim(columns[0]),
		edrpou:	safeTrim(columns[1]),
		clientId:	columns[2].value,
		dateOpen:	columns[3].value,
		typename:	safeTrim(columns[4]),
		dogovorN:	safeTrim(columns[5]),
		dogovorDate:	columns[6].value,
		dover:	safeTrim(columns[7]),
		fio:	safeTrim(columns[8]),
		orderN:	safeTrim(columns[9]),
		limit:	columns[10].value,
		type:	columns[11].value,
		orderId:	columns[12].value,
		netto:	columns[13].value,
		zachet:	columns[14].value,	
		doverDate:	columns[15].value,
		doverSource:	safeTrim(columns[16]),
		typenames:	safeTrim(columns[17]),	
		rest:	columns[18].value,
		clientIsFiz:	columns[19].value,	
	}
	out.push(order);
}

const ordersOpened = (req,res) => {
	const sqltext = createOrdersSQLQuery(req.query);
	console.log("=======sqlText====", sqltext);
	const str = {
		list: [],
		err: ''
	};	
	querySQL(res, sqltext, str, 
		columns => addOrder(str.list, columns)	
	); 			
}

module.exports = ordersOpened;
