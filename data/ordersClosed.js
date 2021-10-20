const { sqlBase, querySQL, safeTrim } = require("../sql.js");

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
		doverDate:	columns[14].value,
		doverSource:	columns[15].value,
		dateClosed:	columns[16].value,
		closeReason:	columns[17].value,	
		rest:	columns[18].value,		
		restSumma:	columns[19].value,			
		typenames:	safeTrim(columns[20]),
	}
	out.push(order);
}

const ordersClosed = (req,res) => {
    const { orderId, client, type } = req.query;
	let where = '';	
	if (orderId)
		where = ` WHERE orderId='${orderId}`;
	if (client || type) {
		const queries = [];	
		if (client) {
			queries.push(`clientId=${client}`);
		}
		if (typ) {
			queries.push(`type=${type}`);
		}
		where = ` WHERE ${queries.join(' AND ')}`;
	}
    const sqltext = `
        SELECT clientname, EDRPOU, clientId, dateOpen, typenames, dogovorN, dogovorDate, dover, fio, orderN, limit, type, orderId, 
            IIF(nettoSum IS NULL, 0, nettoSum )  as netto, doverDate, doverSource, dateClosed, closeReason, rest, restSumma, namess AS typenamess
        FROM ${sqlBase}.ClosedOrders_View
        ${where}
        ORDER BY dateClosed`;

	const str = {
		list: [],
		err: ''
	};	
	querySQL(res, sqltext, str,
		columns => addOrder(str.list, columns)
	);
}

module.exports = ordersClosed;
