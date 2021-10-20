const { querySQL, sqlBase } = require('../sql.js');
	
const params = (req, res) => {
	const sqltext = `
		SELECT name,value FROM ${sqlBase}.config WHERE name='year' 
			UNION
		SELECT name,value FROM ${sqlBase}.config WHERE name='test'`;

	const str = {
		err: null,
		year: null,
		test: null,
	};

	querySQL(res,
		sqltext,
		str,
		columns => {
			const name = columns[0].value.trim();
			const val = columns[1].value.trim();
			if (name == 'year') {
				req.session.year = val;
				str.year = 	val;
			}	
			if (name == 'test') {
				req.session.test = val;
				req.session.testVarning = (val == 1)? '<span style="color:red">УВАГА! ТЕСТОВА БАЗА</span>' : '';
				str.test = 	val;
			}
	}) 	
}	

module.exports = params;
