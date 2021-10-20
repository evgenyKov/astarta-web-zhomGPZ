const { querySQL, sqlBase } = require('../sql.js');

const operatorList = (req, res) => {
	const sqltext = `SELECT name, login FROM ${sqlBase}.Operators_View ORDER BY name`;
	const str = {
		list: [],
		err: '',
	};
	querySQL(res,
		sqltext,
		str,
		columns =>  {
			str.list.push({
				text: columns[0].value,
				id: columns[1].value,
			});
		}
	) 	
}

module.exports = operatorList;
