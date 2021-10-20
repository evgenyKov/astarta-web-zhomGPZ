const addTTN = require('./_addTTN');
const { execStoreProc1, sqlBase, getRandomInt } = require('../sql');
const { bruttoIp, bruttoPort, bruttoCommand, bruttoInit, bruttoGetVes, bruttoKoeff,  fakeBrutto }  = require('../config');

const bruttoVes = (req,res)	=> {
	const { getValue } = require('../remotePort');	
	getValue(bruttoIp, bruttoPort, bruttoCommand, bruttoInit,
		ves => {
			const { taraId, type } = req.body;
			const vesKg = ves * bruttoKoeff;
			console.log("BRUTTO", vesKg);

			const brutto = fakeBrutto ? getRandomInt(1200,1900)*10 : vesKg;
			params = [];
			params.push(['taraId' , 'Int' , +taraId]);
			params.push(['type' , 'Int' , +type]);
			params.push(['brutto' , 'Int' , +brutto]);
			params.push(['operatorId' , 'Int' , req.session.user_id]);
			execStoreProc1(res, `${sqlBase}.Ins_brutto`, params, 
				(rows, result) => {
					if (rows.length > 0)
						addTTN(result, rows[0]);
				}
			)
		},
		err => {
			console.log("VES ERROR", err);
			res.send(JSON.stringify({
				success: false,
				err: err	
			}));
		},
		bruttoGetVes
	)
}

module.exports = bruttoVes;
