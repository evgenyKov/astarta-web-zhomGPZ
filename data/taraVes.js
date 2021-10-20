const { sqlBase, execStoreProc1, getRandomInt } = require('../sql.js');
const { taraIP, taraPort, taraCommand, taraInit, taraGetVes, taraKoeff, fakeTara } = require('../config');
const { getValue } = require('../remotePort');
const addTalon = require('./_addTalon');

const taraVes = (req,res) => {
	getValue(taraIP, taraPort, taraCommand, taraInit, 
		ves => {
			const vesKg = ves * taraKoeff;
			console.log("TARA", vesKg);
			const tara = fakeTara ? getRandomInt(300,900)*10  + vesKg: vesKg;
			const { client, avto, type, orderId } = req.body;
			const params =[];
			params.push(['clientId' , 'Int' , +client]);
			params.push(['avtoId' , 'Int' , +avto]);
			params.push(['tara' , 'Int' , tara]);
			params.push(['orderType' , 'Int' , +type]);
			params.push(['orderId' , 'Int' , +orderId]);			
			params.push(['operatorId' , 'Int' , req.session.user_id]);
			
			execStoreProc1(res, `${sqlBase}.Ins_tara`, params, 
				(rows, result) => {
					if (rows.length > 0)
						addTalon(result, rows[0]);
				}
			)
		},
		err => {
			console.log('ERR', err.message || 'Помилка зважування');
				res.send(JSON.stringify({
				    success: false,
				    err: err	
			}))
		},
		taraGetVes
	)
}

module.exports = taraVes;
