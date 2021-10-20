const { sqlBase, querySQL, safeTrim } = require('../sql.js');

const avtoList = (req, res) => {
    const { id, search, atp } = req.query;
	let where = '';
	if (id) {
        where = `WHERE avtoId=${id}`;
    }
	if (search || atp) {
		const queries = [];	
		if (search) {
			const like = `${search}%`;
			queries.push(`(lastName LIKE '${like}' OR avtoTypename LIKE '${like}' OR nomer LIKE '%${like}' OR trailer LIKE '%${like}' OR drivingPermit LIKE '%${like}')`);
		}
		if (atp) {
            queries.push(`atpId=${atp}`);
        }
		where = `WHERE ${queries.join(' AND ')}`;
	}
    const sqltext = `SELECT 
            firstName,middleName,lastName,avtoId,avtoTypename,avtoTypeId,nomer,trailer,
			drivingPermit,atpname,atpId,clientId, fullname, len, width, hight
        FROM ${sqlBase}.AvtoExt_View
        ${where}
        ORDER BY lastName, middleName`;

	const str = {
	    list: [],
        err:    '',
    }        
	querySQL(res,
		sqltext,
		str,
		columns => {
			const avto = {
			    firstName: columns[0].value,
			    middleName: safeTrim(columns[1]),
			    lastName: safeTrim(columns[2]),
			    avtoId: columns[3].value,
			    avtoTypename: safeTrim(columns[4]),
			    avtoTypeId: columns[5].value,		
			    nomer: safeTrim(columns[6]),
			    trailer: safeTrim(columns[7]),
			    drivingPermit: safeTrim(columns[8]),
			    atpname: safeTrim(columns[9]),
			    atpId: columns[10].value,
			    clientId: columns[11].value,
                clientName: safeTrim(columns[12]),
				len: columns[13].value,
				width: columns[14].value,
				hight: columns[15].value,
				
            }
			str.list.push(avto);
		}
	) 	
}

module.exports = avtoList;
