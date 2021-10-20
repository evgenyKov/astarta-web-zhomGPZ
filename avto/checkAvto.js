const { execQuery, sqlBase, mainConnection } = require('../pools');

const checkAvto = async (req, res) => {
    const { id, source } = req.query;
    const  sqltext = `
        SELECT avtoId
        FROM ${sqlBase}.AvtoExt_View 
        WHERE avtoOriginalId=${id} AND avtoSourceId=${source}`;
    const avtoList = await execQuery(sqltext, mainConnection());
    res.send(JSON.stringify(avtoList));
}

module.exports = checkAvto;
