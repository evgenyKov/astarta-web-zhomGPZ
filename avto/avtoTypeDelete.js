const { sqlBase, execStoreProc1, safeTrim } = require('../sql.js');

const avtoTypeDelete = (req, res) => {
    const { id } = req.body;
    const params = [
        ['id', 'Int' , id]
    ]; 
    execStoreProc1(res, `${sqlBase}.Del_AvtoType`, params, 
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

module.exports = avtoTypeDelete;
