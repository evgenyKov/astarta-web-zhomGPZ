const { sqlBase, execStoreProc1, safeTrim } = require('../sql.js');

const atpDelete = (req, res) => {
    const { id } = req.body;
	const params = [
		['id', 'Int' , id]
	];
    execStoreProc1(res, `${sqlBase}.Del_Atp`, params,
        (rows, result) => {
            rows.map(row => result.push({
				    id:			row[0].value,
				    name:		safeTrim(row[1]),
				    fullname:	safeTrim(row[2]),
				    edrpou:		safeTrim(row[3]),
				    noDelete:	row[4].value
                })
            )
        }
    )
}


module.exports = atpDelete;
