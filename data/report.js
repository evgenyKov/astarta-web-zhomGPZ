const { createBetweenStr } = require('../sql');
const { execQuery, mainConnection } = require('../pools')

const createReportSQLQuery = query => {	
    const {  ttn, from, to, source,  atp, driver, sort } = query;

	const sortField = sort ? sort[0].field : 'acceptDate';
	const sortDirection = sort ? sort[0].direction : 'desc';

    let where = '';
    if (ttn) {
        where = `WHERE nomerttn=${ttn}`;
    } else {
        const queries	=	[];
    	if (source) {
            queries.push(`sourceId=${source}`)
	    }

    	if (atp) {
            queries.push(`atpId=${atp}`)
	    }

    	if (driver) {
            queries.push(`avtoId=${driver}`)
	    }

        if (from || to) {
            queries.push(`( acceptDate ${createBetweenStr(from, to)} )`);
        }
        where = queries.length > 0 ? `WHERE ${queries.join(' AND ')}` : '';
    }
    
    return  `SELECT 
        nomerTTN, acceptDate,
        netto, sourceName,  atpName,
        Trim(lastName) + ' ' + SUBSTRING(firstName,1,1) + '.' + SUBSTRING(middleName,1,1) + '.' AS driver
    FROM taraExt_View
    ${where}
    ORDER BY ${sortField} ${sortDirection}`;
}

const report = async (req,res) => {
	const sqltext = createReportSQLQuery(req.query);
    console.log(sqltext);
    const data = await execQuery(sqltext, mainConnection());
    res.send(data);
}

module.exports = { createReportSQLQuery, report};
