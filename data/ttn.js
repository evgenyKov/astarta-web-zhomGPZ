const { sqlBase, querySQL, safeTrim } = require('../sql');

const ttn = (req,res) => {
    const { ttn, ordertype } = req.query;
	if (!ttn)	
		res.send("{error: 'Не вказано номер ТТН'}");
	if (!ordertype)	
		res.send("{error: 'Не вказано тип ордеру'}");
// ОПлата по факту	
    let sqltext;
	if (ordertype === 2) {
        sqltext = `
            SELECT bruttoId, bruttoDate, brutto, netto, tara, clientId, clientName, orderId, orderDogovorN, netto AS limit, orderN,
			    orderType, orderTypeName, price, summa, koef, pereschet, zachet, nomerTTN, zhomTypeName, netto AS nettoSum, type, openDate, clientIsFiz, closeDate
            FROM ${sqlBase}.BruttoExt_View
            WHERE nomerTTN=${ttn}`
// Давальницька
    } else if (ordertype === 0 ) {
        sqltext = `
            SELECT bruttoId, bruttoDate, brutto, netto, tara, clientId, clientName, BruttoExt_View.orderId, orderDogovorN, limit, orderN,
			    orderType, orderTypeName, price, summa, koef, pereschet, zachet, nomerTTN, zhomTypeName, zachetSum AS nettoSum, type, openDate, clientIsFiz, closeDate
            FROM ${sqlBase}.BruttoExt_View 
            LEFT JOIN ${sqlBase}.BruttoByOrderZ_View ON  BruttoExt_View.orderId = BruttoByOrderZ_View.orderId 
            WHERE nomerTTN=${ttn}`
// Інше
    } else {
		sqltext= `SELECT bruttoId, bruttoDate, brutto, netto, tara, clientId, clientName, BruttoExt_View.orderId, orderDogovorN, limit, orderN, 
			orderType, orderTypeName, price, summa, koef, pereschet, zachet, nomerTTN, zhomTypeName, nettoSum, type, openDate, clientIsFiz, closeDate 
            FROM ${sqlBase}.BruttoExt_View
            LEFT JOIN ${sqlBase}.BruttoByOrder_View ON  BruttoExt_View.orderId = BruttoByOrder_View.orderId
            WHERE nomerTTN=${ttn}`
    }
	const str = {
		list: [],
		err: ''
	};	
	querySQL(res, sqltext, str, 
		columns => {
			const ttn =	{
                bruttoId: columns[0].value,
                bruttoDate: columns[1].value,
                brutto	: columns[2].value,
                netto	: columns[3].value,
                tara	: columns[4].value,
                clientId: columns[5].value,
                clientName: safeTrim(columns[6]),
                orderId	: columns[7].value,
                orderDogovorN: safeTrim(columns[8]),
                limit	: columns[9].value,
                orderN	: safeTrim(columns[10]),
                orderType: columns[11].value,
                orderTypeName: safeTrim(columns[12]),
                price	: columns[13].value,
                summa	: columns[14].value,
                koef	: columns[15].value,
                pereschet: columns[16].value,
                zachet	: columns[17].value,
                nomerTTN: columns[18].value,
                zhomTypeName: safeTrim(columns[19]),
                nettoSum: columns[20].value,
                zhomType: columns[21].value,
                openDate: columns[22].value,
                isFiz	: columns[23].value,
                closeDate: columns[24].value,
            };
			str.list.push(ttn);
		}
	)	
}

module.exports = ttn;
