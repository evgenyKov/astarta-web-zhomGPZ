const { sqlBase, execStoreProc1, safeTrim } = require('../sql.js');

const atpEdit = (req, res) => {
    const { name, fullname, edrpou, id } = req.body;
	const params = [
		['name', 'NVarChar' , name],
		['fullname', 'NVarChar' , fullname],
		['edrpou', 'NVarChar' , edrpou ],		
		['id', 'Int' , id]
	];
    execStoreProc1(res, `${sqlBase}.UPD_Atp`, params,
        (rows, result) => {
    console.log("RESULT", result, rows)
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

module.exports = atpEdit;
