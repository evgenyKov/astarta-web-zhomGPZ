const { sqlBase, execStoreProc1, safeTrim } = require('../sql.js');

const avtoTypeEdit = (req, res) => {
    const { name, id } = req.body;
    const params = [
        ['name', 'NVarChar' , name],
        ['id', 'Int' , id]
    ]; 
    execStoreProc1(res, `${sqlBase}.UPD_AvtoType`, params, 
        (rows, result) => {
            rows.map(row => result.push({
                id: row[0].value,
                name: safeTrim(row[1]),
                noDelete: row[2].value
                })
            )
        }
    )
}

module.exports = avtoTypeEdit;
