const { execQuery, mainConnection } = require('../pools.js');

const drivers = async (req, res) => {
    const { term } = req.query;
    console.log("=========TERM", term);
    const where = term? `WHERE lastName LIKE N'${decodeURIComponent(term)}%'` : '';
 
    const sqltext = `SELECT Trim(lastName) + ' ' + SUBSTRING(firstName,1,1) + '.' + SUBSTRING(middleName,1,1) + '.' AS text, id 
        FROM Avto_View 
        ${where}
        ORDER BY lastName`;
    console.log("=====sqltext", sqltext)
    const data = await execQuery(sqltext, mainConnection())
    res.send(data);
}

module.exports = drivers;
