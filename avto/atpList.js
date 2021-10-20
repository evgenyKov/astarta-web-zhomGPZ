const { sqlBase, querySQL, safeTrim } = require('../sql.js');

const atpList = (req, res) => {
    const { search } = req.query;
    const where = search ? `WHERE name like '%${search}%'`: '';
    const sqltext = `
        SELECT id, name, fullname, edrpou, noDelete 
        FROM ${sqlBase}.ATP_VIEW
        ${where}
        ORDER BY name`;
    const str = {
        list: [],
        err: ''
    }
	querySQL(res,
		sqltext,
		str,
		columns => {
            const atp = {
                id: columns[0].value,
                name: safeTrim(columns[1]),
                fullname: safeTrim(columns[2]),
                edrpou: safeTrim(columns[3]),
                noDelete: columns[4].value,			
            }
			str.list.push(atp);
		}
	) 
}

module.exports = atpList;
