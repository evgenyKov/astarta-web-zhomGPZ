const { safeTrim } = require('../sql.js');

const addTalon = (out,columns) => {
	const talon = {
		taraDate: columns[0].value,
		clientName: safeTrim(columns[1]),
		edrpou: safeTrim(columns[2]),
		isFiz:	columns[3].value,
		targetPunct: safeTrim(columns[4]),
		orderType: columns[5].value,
		firstName: safeTrim(columns[6]),
		lastName: safeTrim(columns[7]),
		middleName: safeTrim(columns[8]),
		avtoTypename: safeTrim(columns[9]),
		nomer: safeTrim(columns[10]),
		trailer: safeTrim(columns[11]),
		drivingPermit: safeTrim(columns[12]),
		atpname: safeTrim(columns[13]),
		tara: columns[14].value,
		fio: safeTrim(columns[15]),
		orderTypeName: safeTrim(columns[16]),
		taraId: columns[17].value,
		limit: columns[18].value,
		netto: columns[19].value,
		orderN: safeTrim(columns[20]),
		avtoId: columns[21].value,
		nomerTTN: columns[22].value,
	}
	out.push(talon);
}

module.exports = addTalon;
