const { sqlBase, querySQL, safeTrim } = require('../sql');

const orderRows= (req, res) => {
        const { sort, orderId = -2} = req.query;
        const sortDef = sort && sort[0];
        let sortField = (sortDef && sortDef.field) || 'bruttoDate';
        const sortDirection = (sortDef && sortDef.direction) || 'asc';

        if (sortField === 'voditel') {
            sortField = "avtoLastName"
        }
        if (sortField === 'avto') {
            sortField = "avtoNomer"
        }

        const sqltext = `
            SELECT bruttoId, netto, bruttoDate, avtoNomer, avtoTrailer, AvtoLastName, avtoFirstName, avtoMiddleName, price, summa, koef,
                pereschet,zachet, nomerTTN, zhomTypeName 
            FROM ${sqlBase}.bruttoExt_View 
            WHERE orderId=${orderId} 
            ORDER BY ${sortField} ${sortDirection}`;
	    const str = {
    		list: [],
		    err: ''
        };
    querySQL(res, sqltext, str, 
		columns => {
			const orderRow = {
                bruttoId: columns[0].value,
                netto: columns[1].value,
                bruttoDate: columns[2].value,
                avtoNomer: safeTrim(columns[3]),
                avtoTrailer: safeTrim(columns[4]),
                avtoLastName: safeTrim(columns[5]),
                avtoFirstName: safeTrim(columns[6]),
                avtoMiddleName: safeTrim(columns[7]),
                price: columns[8].value,
                summa: columns[9].value,
                koef: columns[10].value,
                pereschet: columns[11].value,
                zachet: columns[12].value,
                nomerTTN: columns[13].value,
                zhomTypeName: columns[14].value,
            };
			str.list.push(orderRow);
		}
	)	
}

module.exports = orderRows;
