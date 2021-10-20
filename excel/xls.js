const config = require('../config');
const { sqlBase, dataToExcel, safeTrim } = require("../sql.js");
const {createReportSQLQuery} = require('../data/report');
const styles = require('./styles');

// ---------------------- Реєстр 

const reportXls = (req,res) => {
	/* TODO: clientName, driverName, typeName, orderTypeName
	from = startDate, to = currentDate
	*/

	const { bordered,  borderedCentered, headerRight, headerCenterBig, headerBordered } = styles;
	const specification = {
		date: { width: '10', cellStyle: bordered, displayName: '1', headerStyle: borderedCentered },
		ttn: { width: '8', cellStyle: bordered, displayName: '2', headerStyle: borderedCentered },
		client:{ width: '25', cellStyle: bordered, displayName: '3', headerStyle: borderedCentered },
		orderFio:{ width: '20', cellStyle: bordered, displayName: '4', headerStyle: borderedCentered },
		orderDogovorN:{ width: '15', cellStyle: bordered, displayName: '5', headerStyle: borderedCentered },
		order:{ width: '10', cellStyle: bordered, displayName: '6', headerStyle: borderedCentered },
		type: { width: '8', cellStyle: bordered, displayName: '7', headerStyle: borderedCentered },
		netto: { width: '10', cellStyle: bordered, displayName: '8', headerStyle: borderedCentered },
		zachet: { width: '10', cellStyle: bordered, displayName: '9', headerStyle: borderedCentered },
		price: { width: '10', cellStyle: bordered, displayName: '10', headerStyle: borderedCentered },
		summa: { width: '10', cellStyle: bordered, displayName: '11', headerStyle: borderedCentered },
		orderType: { width: '20', cellStyle: bordered, displayName: '12', headerStyle: borderedCentered },
		driver: { width: '20', cellStyle: bordered, displayName: '13', headerStyle: borderedCentered },
	}	

	const { from, to, client, driver, type, orderType } = req.query;
	const heading = [
		[ 
			'', '', '', 
			{ value: config.reesterHeader1, style: headerRight }, 
		],  
		[ 
			'', '', '', 
			{ value: config.reesterHeader2, style: headerRight }, 
		],  
		[ 
			'' 
		],  
		[ 
			'', 
			{ value: 'РЕЄСТР ВІДПУСКУ ЖОМУ', style: headerCenterBig }, 
		],  
		[
			'', 
			{ value: `за період з  ${from || ''} по ${to || ''}`, style: styles.headerCenter}, 
		],  
		[
			''
		], 
		[
			{ value: 'Дата', style: headerBordered },
			{ value: '№ ТТН на відпуск жому', style: headerBordered },
			{ value: 'Кому відпущено', style: headerBordered },
			{ value: 'Отримав', style: headerBordered },
			{ value: 'Договір', style: headerBordered },
			{ value: '№ накладної на відпуск жому', style: headerBordered },
			{ value: 'Жом свіжий/ кислий', style: headerBordered },
			{ value: 'Фізична вага відпущеного жому, тон', style: headerBordered },	
			{ value: 'Залікова  вага відпущеного жому, тон', style: headerBordered },
			{ value: 'Ціна грн/тона', style: headerBordered },
			{ value: 'Вартість', style: headerBordered },
			{ value: 'Вид оплати', style: styles.headerBordered },
			{ value: 'Водій', style: styles.headerBordered },
		]
	];

	const descr = {
		name: 'Реєстр відпуску жому',
		heading, 
		specification, 
		data: []
	}
	
	let netto	=	0;
	let summa	=	0;
	let zachet	=	0; 
	
/*	
var zhomTypeName = 
	{
	1: "Свіж.",
	2: "Кисл.",
	3: "Прес.",		
	}	
*/
	
	const sqltext = createReportSQLQuery(req.query);


//bruttoDate, nomerTTN, clientName, orderN, orderTypeName, zhomTypeName, netto, zachet, price, summa, orderType, namess
		
	dataToExcel(res, sqltext, descr, 
		columns => {
			const obj = {
				date:	columns[0].value.substr(0,10),
				ttn:	`00000${columns[1].value}`.substr(-5),
				client:	columns[2].value,
				order:	columns[3].value || '',
				type:	columns[5].value,
				netto:	(columns[6].value/1000).toFixed(2),
				zachet:	(columns[7].value/1000).toFixed(2),
				price:	(columns[8]).value.toFixed(2),
				summa:	(columns[9]).value.toFixed(2),
				orderType:	safeTrim(columns[11]),
				driver: columns[12].value,
				orderFio: columns[13].value, 
				orderDogovorN: columns[14].value, 
			};

			summa = summa + (+obj.summa);
			netto = netto + (+obj.netto);		
			zachet = zachet + (+obj.zachet);			
	
			obj.netto	= obj.netto.replace('.', ',');
			obj.price	= obj.price.replace('.', ',');
			obj.zachet	= obj.zachet.replace('.', ',');
			obj.summa	= obj.summa.replace('.', ',');
			descr.data.push(obj);
		}, 
		null, 
		list => {
			list.push({
				date: '',
				ttn: '',
				client: 'ВСЬОГО',
				order: '',
				type: '',
				netto: netto,
				zachet: zachet,
				price: '',
				summa: summa,
				orderType: '',
				driver: '',
			});
			}
		);
}		

// ---------------------- Заборна відомість

const orderXls = (req,res) => {
	const { id, limit, nomer, client, dover, fio, type } = req.query;
/*
	id = 1013;
	limit = 1000;
	nomer = "123";
	client = "ТОВ АФ 'Добробут'";
	dover = "DOV";
	fio = "FIO";
*/
		
	const specification = {
		nom:		{ width: '6', cellStyle: bordered, displayName: '№ п/п', headerStyle: borderedCentered },
		date:		{ width: '12', cellStyle: bordered, displayName: 'Дата відпуску', headerStyle: borderedCentered },
		ttn:		{ width: '10', cellStyle: bordered, displayName: '№ ТТН', headerStyle: borderedCentered },
		voditel:	{ width: '19', cellStyle: bordered, displayName: 'ПІБ водія автомобіля', headerStyle: borderedCentered },
		avto:		{ width: '23', cellStyle: bordered, displayName: 'Марка, держ № автомобіля', headerStyle: borderedCentered },
		type:		{ width: '12', cellStyle: bordered, displayName: "Вид жому", headerStyle: borderedCentered },
		koef:		{ width: '11', cellStyle: bordered, displayName: 'Вміст СР (%)', headerStyle: borderedCentered },
		netto:		{ width: '10', cellStyle: bordered, displayName: 'Нетто (тон)', headerStyle: borderedCentered },
		zachet:		{ width: '12', cellStyle: bordered, displayName: 'Залікова вага', headerStyle: borderedCentered },
		sumZachet:	{ width: '12', cellStyle: bordered, displayName: 'Відпущено всього', headerStyle: borderedCentered },
		rest:		{ width: '12', cellStyle: bordered, displayName: 'Залишок', headerStyle: borderedCentered }	
	}

	const heading = [
		[
			'', '', '', '', '', 
			{ value: 'ВП "Яреськівський цукрозавод"', style: styles.headerCenter}, 
		],  
		[
			'', '', '', '', '', 
			{ value: 'ТОВ АФ ім Довженка', style: styles.headerCenter}, 
		],  
		[
			''
		],  
		[
			'', '', '', '', '', 
			{ value: 'Забірна відомість № ' + nomer + ' на відпуск ' + ((type==1)? 'купівельного':'давальницького') + ' жому в кількості ' + limit + ' тон ' +
			((type==1)? 'фізичної': 'залікової') + ' ваги', style: headerCenterBig }, 
		],  
		[
			''
		],  			
		[
			'',
			{ value: 'Назва Покупця:    ' + client, style: styles.header}
		], 
		[
			'',
			{ value: 'За дорученням №  ' + dover + '   через  ' + fio, style: styles.header }
		],
		[
			''
		],  			
	];

	const descr = {
		heading,
		specification,
		data: [],
		name: 'Забірна відомость'
	}	
//SQL	
	const sqltext = `
					SELECT bruttoDate, nomerTTN, avtoLastName, avtoMiddleName, avtoFirstName, avtoTypeName, avtoNomer, avtoTrailer,
						zhomTYpeName, koef, netto,zachet 
					FROM ${sqlBase}.BruttoExt_View WHERE orderId='${id}' ORDER BY nomerTTN`;	

	let rowNom = 0;
	let sumZachet = 0; 
	sql.dataToExcel(res,sqltext,descr, 
		columns => {
			rowNom++;
			const obj = {
				date:	columns[0].value,
				ttn:	columns[1].value,
				voditel: `${columns[2].value.trim()} ${columns[4].value.substr(0,1)}. ${columns[3].value.substr(0,1)}.`,
				avto: 	`${columns[5].value.trim()}, ${columns[6].value.trim()}${((columns[7].value > 0)? ", причіп " + columns[7].value.trim()  : '')}`,
				type:	columns[8].value,
				koef:	columns[9].value,
				netto:	columns[10].value/1000,
				zachet:	columns[11].value/1000,
				nom:	rowNom,
			};
			sumZachet += (type == 1)?  obj.netto : obj.zachet;
			obj.sumZachet = sumZachet;
			obj.rest = limit - sumZachet;
			descr.data.push(obj);
 	});
}

		
// ---------------------- Список забірних відомостей

const ordersXls = (req,res) => {
	const {client, type } = req.query;
	

	const specification = {
		clientname: { width: '25', cellStyle: bordered, displayName: '1', headerStyle: borderedCentered },
		EDRPOU: { width: '11', cellStyle: bordered, displayName: '2', headerStyle: borderedCentered },
		dateOpen:{ width: '10', cellStyle: bordered, displayName: '3', headerStyle: borderedCentered },
		typename:{ width: '10', cellStyle: bordered, displayName: '4', headerStyle: borderedCentered },
		dogovorN: { width: '10', cellStyle: bordered, displayName: '5', headerStyle: borderedCentered },
		dogovorDate: { width: '10', cellStyle: bordered, displayName: '6', headerStyle: borderedCentered },
		dover: { width: '10', cellStyle: bordered, displayName: '7', headerStyle: borderedCentered },
		dover: { width: '10', cellStyle: bordered, displayName: '8', headerStyle: borderedCentered },
		doverSource: { width: '10', cellStyle: bordered, displayName: '9', headerStyle: borderedCentered },
		fio: { width: '10', cellStyle: bordered, displayName: '10', headerStyle: borderedCentered },
		orderN: { width: '10', cellStyle: bordered, displayName: '11', headerStyle: borderedCentered },
		limit: { width: '10', cellStyle: bordered, displayName: '12', headerStyle: borderedCentered },
		netto: { width: '10', cellStyle: bordered, displayName: '13', headerStyle: borderedCentered },
		zachet: { width: '10', cellStyle: bordered, displayName: '14', headerStyle: borderedCentered }
	}	

	const heading = [
		[
			'', '', '', 
			{ value: 'ВП "Яреськівський цукрозавод"', style: styles.header}, 
		],  
		[
			'', '', '', 
			{ value: 'ТОВ АФ ім Довженка', style: styles.header}, 
		],  
		[
			''
		],  
		[
			'', 
			{ value: 'ВІДКРИТІ ЗАБІРНІ ВІДОМОСТІ', style: styles.header}, 
		],  
		[
			'', 
			{ value: `станом на  _______ 20${config.year}`, style: styles.header}, 
		],  
		[
			''
		], 
		[
			{ value: 'Клієнт', style: headerBordered }, 
			{ value: 'ЄДРПОУ', style: headerBordered }, 	
			{ value: 'Відкрито', style: headerBordered }, 	
			{ value: 'Вид', style: headerBordered }, 	
			{ value: 'Договір', style: headerBordered }, 	
			{ value: 'Від', style: headerBordered }, 	
			{ value: 'Доручення', style: headerBordered },
			{ value: 'Видане', style: headerBordered },	
			{ value: 'Отримувач', style: headerBordered },
			{ value: 'Номер', style: headerBordered },
			{ value: 'Ліміт', style: headerBordered },
			{ value: 'Нетто', style: headerBordered },
			{ value: 'Залік', style: styles.headerBordered}			
		]
	];

	const descr = {
		name: 'Забірні відомості',
		heading: heading, 
		specification: specification, 
		data: []
	}
	
	const queries = [];	
	if (client) {
		queries.push(`clientId='${client}'`);
	}
	if (type) {
		queries.push(`type='${type}'`);
	}
	const where = queries.length > 0 ? `WHERE ${queries.join(' AND ')}` : '';
	const sqltext = `
		SELECT clientname, EDRPOU, dateOpen, typenames, dogovorN, dogovorDate, dover, doverDate, doverSource, 
			fio, orderN, limit, IIF(nettoSum IS NULL, 0, nettoSum )  as netto, IIF(zachetSum IS NULL, 0, zachetSum )  as zachet  
		FROM ${sqlBase}.OpenOrders_View ${where} ORDER BY dateOpen`;	
	
	dataToExcel(res,sqltext,descr, 
		columns => {
			const obj = {
				clientname: safeTrim(columns[0]),
				EDRPOU:		safeTrim(columns[1]),
				dateOpen:	columns[2].value,
				typename:	safeTrim(columns[3]),
				dogovorN:	columns[4].value,
				dogovorDate:	columns[5].value,
				dover:	columns[6].value,
				doverDate:	columns[7].value,
				doverSource:	columns[8].value, 
				fio:	columns[9].value,
				orderN:	columns[10].value,
				limit:	columns[11].value,
				netto:	columns[12].value,
				zachet:	columns[13].value,
			};
			descr.data.push(obj);
	});
}

module.exports = { reportXls, orderXls, ordersXls }
