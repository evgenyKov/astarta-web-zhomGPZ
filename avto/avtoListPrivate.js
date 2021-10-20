const { sqlBase, querySQL, safeTrim } = require('../sql.js');

const avtoListPrivate = (req, res) => {
    const  sqltext = `
        SELECT 
            firstName, middleName, lastName, avtoId, nomer, trailer,
            drivingPermit, avtoTypeId, len, width, hight
        FROM ${sqlBase}.AvtoExt_View 
        WHERE isFiz = 1 
        ORDER BY lastName, middleName`;
    const str = {
        list: [],
        err: ''
    }
    
	querySQL(res,
		sqltext,
		str,
		columns => {
            const avto = {
                firstName: columns[0].value,
			    middleName: safeTrim(columns[1]),
			    lastName: safeTrim(columns[2]),
                id: columns[3].value,
			    nomer: safeTrim(columns[6]),
			    trailer: safeTrim(columns[7]),
			    drivingPermit: safeTrim(columns[8]),
                avtoTypeId: columns[7].value,
                len: columns[8].value,
                width: columns[9].value,
                hight: columns[10].value

            }
			str.list.push(avto);
		}
	) 	
}

module.exports = avtoListPrivate;
