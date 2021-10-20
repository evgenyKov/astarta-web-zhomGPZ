const { querySQL, sqlBase } = require('../sql');

const reportCashe = (req,res) => {
	const { period } = req.query;
    let sqltext;
	if (period === 'day')
		sqltext = `SELECT fakt, predoplata, orders, date AS period FROM ${sqlBase}.CasheByDateSumm_View ORDER BY date DESC`;	
	if (period === 'mes')
		sqltext = `SELECT SUM(fakt), SUM(predoplata), SUM(orders), mes  AS period FROM ${sqlBase}.CasheByDateSumm_View GROUP BY mes ORDER BY mes ASC`;	
	if (period === 'year')
		sqltext = `SELECT SUM(fakt), SUM(predoplata), SUM(orders), year AS period FROM  ${sqlBase}.CasheByDateSumm_View GROUP BY year ORDER BY year ASC`;	
	if (period === 'season')
		sqltext = `SELECT SUM(fakt), SUM(predoplata), SUM(orders), 'ЗА CЕЗОН' AS period FROM  ${sqlBase}.CasheByDateSumm_View`;
	if (sqltext) {
        const str = {
			list: [],
			err: ''
		};	
		querySQL(res, sqltext, str, 
			columns => {
				str.list.push({
					'fakt': columns[0].value.toFixed(2),
					'predoplata':   columns[1].value.toFixed(2),
					'orders':   columns[2].value.toFixed(2),
					'period':   columns[3].value			
					}
				)
			}
		)
		
	} else {
        res.send(JSON.stringify({err : "Тип періоду не вказаний або неправильний"}));
	}		
}

module.exports = reportCashe;
