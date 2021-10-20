const { sqlBase, execStoreProc } = require('../sql.js');

const avtoEdit = (req, res) => {
	const params =[];
	for (let field in req.body) {
		let type = ['avtoId','atpId','avtoTypeId', 'len', 'width', 'hight'].includes(field) ? 'Int' : 'NVarChar';
		params.push([field , type , req.body[field]]);
	}
	execStoreProc(res, `${sqlBase}.UPD_Avto`, params);
}

module.exports = avtoEdit;
