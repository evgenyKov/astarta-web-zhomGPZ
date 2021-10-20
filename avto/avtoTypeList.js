const { sqlBase, querySQL, safeTrim } = require('../sql.js');

const avtoTypeList = (req, res) => {
	const sqltext = `SELECT id , name,  noDelete FROM ${sqlBase}.AvtoType_View ORDER BY name`;
	const str = {
        list: [],
        err: ''
    }
	querySQL(res,
		sqltext,
		str,
		columns => {
			const type = {
                id: columns[0].value,
                name: safeTrim(columns[1]),
                noDelete: columns[2].value,
            }
			str.list.push(type);
		}
	); 
}

module.exports = avtoTypeList;
