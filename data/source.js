const { sqlBase, querySQL } = require('../sql');

const source = (req, res) => {
        const sqltext = `
            SELECT id, name, directCopy, gbkId
            FROM ${sqlBase}.Source 
            ORDER BY name`;
	    const str = {
    		list: [],
		    err: ''
        };
    querySQL(res, sqltext, str, 
		columns => {
			const sourceRow = {
                id: columns[0].value,
                text: columns[1].value,
                directCopy: columns[2].value,
                gbkId: columns[3].value,
            };
			str.list.push(sourceRow);
		}
	)	
}

module.exports = source;
