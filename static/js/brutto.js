// const currentDate = getFormatDate();
let barCodOk = false;
let	sourceOk = false;

const getFioFromNames = (lastName, firstName, middleName) => `${lastName} ${firstName.substr(0,1)}. ${middleName.substr(0,1)}.`;

const getVoditel = item => {
	const { avtoLastName, avtoFirstName, avtoMiddleName } = item;
	return `${avtoLastName} ${avtoFirstName} ${avtoMiddleName}`;
}
const getVoditelFio = item => {
	const { avtoLastName, avtoFirstName, avtoMiddleName } = item;
	return getFioFromNames(avtoLastName, avtoFirstName, avtoMiddleName);
}

/*
const reloadTTN = () => {
	const orderType = getValue('filterOrderType');
	const type = getValue('filterType');
	const from = getValue('filterFrom');
	const to = getValue('filterTo');
	const client = getValue('filterClient');
	const ttn = getValue('filterTTN');

	const queries = [];	
	if (ttn)
		queries.push(`ttn=${ttn}`);
	if (orderType)
		queries.push(`orderType=${orderType}`);
	if (type)
		queries.push(`type=${type}`);
	if (from)
		queries.push(`from=${from}`);
	if (to)
		queries.push(`to=${to}`);
	if (client)
		queries.push(`client=${client}`);
	w2ui['ttnGrid'].url = `/api/brutto?${queries.join('&')}`;
	w2ui['ttnGrid'].reload();
}
*/
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const errMess = {
//	1: 'Неіснуюча тара',
//	2: 'Вага брутто менша, ніж тара',
//	3: 'Повторне зважування',
//	4: 'Невірний тип жому',
//	5: 'Відсутні дані про якість жому',
//	6: 'На цю дату відсутні дані по якості жому',
//	7: 'Відсутні дані про ціну жому',	
//	8: 'На цю дату відсутні дані про ціну жому'
}

/*
const zhomTypeNames = {
	1: 'свіжий',
	2: 'кислий',		
	3: 'пресований'	
}

const zhomTypesSelect = [
	{id: 1, text: 'свіжий'},
	{id: 2, text: 'кислий'},		
	{id: 3, text: 'пресований'}	
]	

const configTalons = {
	url: 'api/talons',

	name: 'talonGrid',

	header: 'Незакриті талони на відпуск жому',
	method: 'GET',

	show: {
		header: true,
		footer: true,
	},
	
	multiSearch: false,

	searches:[
	],
	
	columns:[
		{ field: 'taraDate',	caption: 'Дата', size: '25%', sortable: true },
		{ field: 'clientName',	caption: 'Клієнт', size: '40%', sortable: true },
		{ field: 'avto',	caption: 'Автобоміль', size: '35%', sortable: true },
	],
	
	sortData:[
	],
	
	onLoad: (event) => {
		const resp = $.parseJSON(event.xhr.responseText);
		const records = getTalonRecords(resp);
		event.xhr.responseText = {
			"success": true,
			"records": records,
			"total": records.length
		};
	},
	
	onSort: (event) => {},
}

const configTTN = {
	url: 'api/brutto',

	name: 'ttnGrid',

	method: 'GET',

	show: {
		header: true,
		footer: true,
	},
		
	multiSearch: false,

	searches: [
		],
		
	columns: [
		{ field: 'nomerTTN',		caption: '№', size: '7%', sortable: true },
		{ field: 'bruttoDate',		caption: 'Дата', size: '13%', sortable: true },
		{ field: 'clientName',		caption: 'Клієнт', size: '23%', sortable: true },
		{ field: 'brutto',			caption: 'Брутто', size: '5%', sortable: true },
		{ field: 'netto',			caption: 'Нетто', size: '5%', sortable: true },			
		{ field: 'orderTypeName',	caption: 'Підстава відпуску', size: '20%', sortable: true },
		{ field: 'avto',			caption: 'Автомобіль', size: '12%', sortable: true },
		{ field: 'voditel',			caption: 'Водій', size: '20%', sortable: true},
	],
	
	sortData:[
	],
	
	onLoad: async (event) => {
		const resp = $.parseJSON(event.xhr.responseText);
		console.log("RESP", resp);
		const records = getTTNRecords(resp);
        event.xhr.responseText = {
			"success": true,
			"records": records,
			"total": records.length,
		}
	},
	
	onSort: (event) => {},

	onDblClick: (event) => {
		const item = w2ui['ttnGrid'].records[event.recid];
		writeTTNInfo(item);
		if (item.clientIsFiz)
			writeOrderInfo(item);
		$('.nav-tabs a:first').tab('show'); 
    }
}
	
const getTalonRecords = (resp) => {
	console.log("getTalonRecords", resp.list);
	w2ui['talonGrid'].records = w2ui['talonGrid'].records || [];
	
	const records = resp.list.map((item, index) => {
        item.recid = index;
		item.avto = `${item.nomer} (${item.lastName})`;
		return item;
	})

	w2ui['talonGrid'].records = w2ui['talonGrid'].records.concat(records);
	w2ui['talonGrid'].total = resp.total;
	return records;
}

const getTTNRecords = (resp) => {
	w2ui['ttnGrid'].records = w2ui['ttnGrid'].records || [];
	console.log("TTN RECORDS1", w2ui['ttnGrid'].records);

	const records = resp.list.map((item, index) => {
        item.voditel = getVoditelFio(item);
        item.avto = item['avtoNomer'];		
		item.recid = index;
		return item;
	})
	w2ui['ttnGrid'].records = w2ui['ttnGrid'].records.concat(records);
	w2ui['ttnGrid'].total = resp.total;
	return records;
}

const writeOrderInfo = (item) => {
	writeOneOrderInfo(item,'');
	writeOneOrderInfo(item,'1');
}
	
const writeOneOrderInfo = (item, pref) => {
	const monthNames = {
		'01':'січня',
		'02':'лютого',
		'03':'березня',
		'04':'квітня',
		'05':'травня',
		'06':'червня',
		'07':'липня',
		'08':'серпня',
		'09':'вересня',
		'10':'жовтня',
		'11':'листопада',
		'12':'грудня',
	};	
	const doc = orderFrame.contentWindow.document;
	const writeField = (name, value) => {
		doc.getElementById(`order${name}${pref || ''}`).innerHTML = value
	};	

	const { bruttoDate, nomerTTN, clientFullName, type, netto, price, summa, bruttoOperatorName, clientName } = item;
	const [year, month, date ] = bruttoDate.substr(0,10).split('-');

	writeField('Date', date);
	writeField('Month', monthNames[month]);
	writeField('Year', year);
	writeField('Nomer', `00000${nomerTTN}`.substr(-6));
	writeField('Zavod', CONST_ttnOtpravitel);
	writeField('CleintFullName', clientFullName);
	writeField('ZhomType', zhomTypeNames[type]);
	writeField('Netto', (netto/1000).toFixed(3));
	writeField('Price', price.toFixed(2));
	writeField('Price', summa.toFixed(2));
	writeField('PDV', (summa/6).toFixed(2));
	writeField('Operator', bruttoOperatorName);
	writeField('ClientName', clientName);
}
	
const writeTTNInfo = (item) => {
	const doc =	ttnFrame.contentWindow.document;
	const writeField = (name, value) => {
		//doc.getElementById(`order${name}${pref || ''}`).innerHTML = value
		doc.getElementById(`${name}`).innerHTML = value || '';
	};	
	const { nomerTTN, bruttoDate, taraDate, avtoTypeName, avtoNomer, avtoTrailer, avtoAtpName, avtoDrivingPermit,
			avtoFirstName, avtoLastName, avtoMiddleName, 
			clientFullName, clientTargetPunct, clientEdrpou, orderDover, orderDoverDate, orderFio,
			koef, price, summa, brutto, tara, netto, zachet, prostoy, bruttoOperatorName, 
			orderTypeName, type, width, hight, len, atpEdrpou  } = item;

	const [year, month, date ] = bruttoDate.substr(0,10).split('-');
	const bruttoTonn = (brutto/1000).toFixed(3)
	const voditel = getVoditel(item);
	const voditelShort	= getVoditelFio(item);
    writeField('misce',CONST_ttnMisce)
	writeField('nomerTTN', `00000${nomerTTN}`.substr(-6));
	writeField('dateTTN', `${date}-${month}-${year}`);
	writeField('avtoNomer', `${avtoTypeName} номер ${avtoNomer}`);
	writeField('avtoTrailer', avtoTrailer);
	writeField('avtoVoditel', voditel);
	writeField('avtoATP', avtoAtpName);
	writeField('avtoDrivenPermit', avtoDrivingPermit);
	writeField('width',width);
	writeField('hight',hight);
	writeField('len',len)
	writeField('client', clientFullName);
	writeField('clientEdrpou', clientEdrpou);
	writeField('client2', clientFullName);
	writeField('client2Edrpou', clientEdrpou);
	writeField('targetPunct', clientTargetPunct);
	writeField('price', price.toFixed(2));
	writeField('summa', summa.toFixed(2));
	writeField('pdv', (summa/6).toFixed(2));
	writeField('summa1', summa.toFixed(2));
	writeField('brutto1', bruttoTonn);
	writeField('brutto2', bruttoTonn);
	writeField('brutto3', brutto);
	writeField('tara', tara);
	writeField('netto', netto);
	writeField('zachet', zachet);
	writeField('taraDate', taraDate.substr(11, 5));
	writeField('bruttoDate', bruttoDate.substr(11, 5));
	writeField('prostoy', prostoy);
	writeField('bruttoOperator2', bruttoOperatorName);
	writeField('bruttoOperator3', bruttoOperatorName);
	writeField('zhomType', zhomTypeNames[type]);
	writeField('otpravitel', CONST_ttnOtpravitel);
	writeField('otpravitelEdrpou', CONST_ttnOtpravitelEdrpou);
	writeField('startPunct', CONST_ttnPunct);
	writeField('avtoATPEDRPOU', atpEdrpou)
	writeField('avtoTara', `${tara} кг.`);
	writeField('avtoBrutto', `${brutto} кг.`)
	writeField('koef', koef.toFixed(2));
	writeField('avtoVoditel2', voditel);
	writeField('brutto', bruttoTonn);


	setEnable('printOrder', item.clientIsFiz);
	setEnable('printTTN', (getValue('avto').length <13 ));
	writeInfo({
		clientName:		clientFullName,
		edrpou:			clientEdrpou,
		targetPunct:	clientTargetPunct,
		firstName:		avtoFirstName,
		middleName:		avtoMiddleName,
		lastName:		avtoLastName,
		drivingPermit:	avtoDrivingPermit,
		nomer:			avtoNomer,
		trailer:		avtoTrailer,
		avtoTypename:	avtoTypeName,
		atpname:		avtoAtpName,
		orderTypeName:	orderTypeName,
		limit:			limit,
		netto:			netto,
		taraId:			0
	});
}
*/	
const writeInfo = (info) => {
	console.log("=======================", info)
	if (info) {
		const { message, firstName,middleName, lastName, drivingPermit, nomer, trailer,
			avtoTypeName, atpname, brutto, tara, netto, acceptDate, nomerTTN } = info;
		$('#message').html(message);
		$('#firstName').html(firstName);
		$('#middleName').html(middleName);
		$('#lastName').html(lastName);
		$('#drivingPermit').html(drivingPermit);
		$('#nomer').html(nomer);
		$('#trailer').html(trailer);
		$('#avtoTypename').html(avtoTypeName);
		$('#atpname').html(atpname);	
		$('#nomerTTN').html(nomerTTN);	
		$('#bruttoVes').html(brutto);	
		$('#tara').html(tara);	
		$('#netto').html(netto);	
		$('#acceptDate').html(acceptDate);	
	
		$('.info').removeClass('red');
		$('.info').addClass('green');
	} else {
		$('#firstName').html('');
		$('#middleName').html('');
		$('#lastName').html('');
		$('#drivingPermit').html('');
		$('#nomer').html('');
		$('#trailer').html('');
		$('#avtoTypename').html('');
		$('#atpname').html('');	
		$('#bruttoVes').html('');	
		$('#tara').html('');	
		$('#netto').html('');	
		$('#acceptDate').html('');	
		
		$('.info').removeClass('green');
		$('.info').addClass('red');	
	}	
}	
	
const changeAvto = async () => {
	console.log("===call ChangeAvto");
	const barcod = $('#avto').val();
	if (barcod.length == 13) {
		let err;	
		if (barcod.substr(0,2) !='95')
			err = 'ERR1';
		if (err) {
			alertErr('Невірний штрих-код');	
			return;
		}
		const avtoId = barcod.substr(6,6);
		const source = $('#source').val();
		/*  Получаем игформацию об автомобиле.
			Если автомобиля еще нет в базе автомобилей - запрос к БД соответствующего завода и копирование информации
		*/ 
		try {
			const avtoResp = await fetch(`/api/getAvto?id=${avtoId}&source=${source}`);
			const avtoInfo = await avtoResp.json();

			if (avtoResp.status === 200) {
				const sourceData = $("#source").select2('data');
				const { gbkId, directCopy } = sourceData;
				if (directCopy) {
					const ttnResp =  await fetch(`/api/getTTN?id=${avtoId}&source=${source}&gbk=${gbkId}`);
					const ttnInfo = await ttnResp.json();
					console.log("===ttnInfo", ttnInfo);
					const { tara='', brutto='', netto='',acceptDate='', nomerTTN='' } = ttnInfo[0] || {}
				writeInfo({...avtoInfo, tara, brutto, netto, acceptDate, nomerTTN })
				} else {
					barCodOk = true;
					checkButtonsEnable();
				}
			} else {

			}
		} catch (e) {
			alertErr(`Помилка при визначенні автомобіля. ${e.message}`);
		}
	}

}


/*
const showDayTTN = (currentDate) => {
	setTTNGridConfig(w2ui['ttnGrid'], currentDate)
	reloadTTN();		
}

const showAllTTN = () => {
	const date = getFormatDate();
	setValue('filterFrom', date);	
	setValue('filterTo', date);
	reloadTTN();		
}
	
const setTTNGridConfig = (config, currentDate) => {
	const dateSearch = currentDate ? `?date=${currentDate}` : '';
	config.url = `/api/brutto${dateSearch}`;
	config.header = currentDate 
		? `${currentDate}&nbsp;<a href='javascript: showAllTTN()'>Архів</a>`
		: `За весь час &nbsp; <a href='javascript: showDayTTN(getFormatDate())'>Сьогодні</a>`;
}
*/	
const checkButtonsEnable = () => {
	setEnable('submit', barCodOk &&  sourceOk);
}

const checkAvtoEnable = () => {
	console.log("=====SOURCE", sourceOk)
	setEnable('avto', sourceOk);
}

/*
const printTTN = (count) => {
	if (count > 1) {
		sleep(CONST_PRINTER_SLEEP)
			.then(
				() => {
					printTTN(count-1)
				}
			)
	};

	if (count > 0) {
		ttnFrame.focus();
		ttnFrame.contentWindow.print();
	}
}
	
const printOrder = () => {	
	orderFrame.focus();
	orderFrame.contentWindow.print();
}
*/	

function debounce(func, wait, immediate) {
	let timeout;
  
	return function executedFunction() {
	  const context = this;
	  const args = arguments;
  
	  const later = function() {
		timeout = null;
		if (!immediate) func.apply(context, args);
	  };
  
	  const callNow = immediate && !timeout;
  
	  clearTimeout(timeout);
  
	  timeout = setTimeout(later, wait);
  
	  if (callNow) func.apply(context, args);
	};
};

const debouncedChangeAvto = debounce(changeAvto, 250);

$(document).ready(function() {
	$.getJSON("/api/source", (source) => {
		$("#source").select2({
			data: source.list,
			allowClear: true,	
			width: '100%'
		})
		.on('change', () => {
			sourceOk = (getValue('source') > '');
			checkButtonsEnable()
			checkAvtoEnable()
			}
		);		
	})

	$('#avto').on('keyup',function() {
		debouncedChangeAvto();
	})
		
	$('#submit').on('click', function() {
		$('#bruttoForm').submit()
	});
			
	$('#bruttoForm').submit(function() {
        const data = {
			taraId: getValue('taraId'),
			type:	getValue('type')
		};

       $.ajax({
            type: 'POST',
            url: '/api/brutto',
            data: JSON.stringify(data),
            async: false,
            success: function (resp) {
                if (resp.success){
//					alertSuc('<span style='font-size:18pt;'>Вага нетто ' + resp.list[0].netto +  '</span>');
					writeTTNInfo(resp.list[0]);
					printTTN(getValue('printCount'));
					writeOrderInfo(resp.list[0]);
				} else {
					if (resp.err) {
						alertErr(resp.mess)
					} else {
						if (resp.ret > 0) {
							alertErr(errMess[resp.ret]);	
						}
					}	
				}
				w2ui['talonGrid'].reload();
				w2ui['ttnGrid'].reload();							
			},
            error: function (resp) {
                alertErr('Помилка оновлення даних. Зверніться до адміністратора');
			},
            cache: false,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            processData: false
		});
        return false;
	});
/*		
	$('#printTTN').on('click', 
		function() {
			printTTN(getValue('printCount'));
		});

	$('#talon').w2grid(configTalons);
	
	setTTNGridConfig(configTTN,currentDate)
	$('#ttn').w2grid(configTTN);

	$(`a[href='#talon']`).on('shown.bs.tab', function (e) { 
		w2ui['talonGrid'].resize(); 
	});

	$(`a[href='#archive']`).on('shown.bs.tab', function (e) { 
		w2ui['ttnGrid'].resize();
	});
		
	$('.date').datepicker().on('change', function() {
		reloadTTN();
	});

	$('#filterTTN').on('keyup', function(e) {
		reloadTTN();
	});

	$('#filterOrderType').select2({	
		data: [
			{ id: 0, text: 'Давальницька схема (ю)' },
			{ id: 1, text: 'Передплата рахунком' },
			{ id: 3, text: 'Відпуск для власних потреб' },
			{ id: 4, text: 'Передплата готівкою' },
			{ id: 5, text: 'Переміщення' },
			{ id: 6, text: 'Давальницька схема (ф)' }
		],
		allowClear: true,
	})
	.on('change', function() {
		reloadTTN();
	});
	
	$('#filterType').select2({
		width:200,
		placeholder: 'Тип жому',
		data: 
			zhomTypesSelect
	})
	.on('change', function() {
		reloadTTN();
	});
		
	$('#printOrder').on('click',
		function() {
			printOrder();
		}
	);
		
	ttnFrame = document.createElement('iframe');
//	ttnFrame.height=1000;
//	ttnFrame.width=1000;
	ttnFrame.height=0;
	ttnFrame.width=0;
	
	ttnFrame.src='tmp/ttn.html';	
	document.body.appendChild(ttnFrame);
	
	orderFrame = document.createElement('iframe');
//	orderFrame.height=1000;
//	orderFrame.width=1000;
	orderFrame.height=0;
	orderFrame.width=0;
	orderFrame.src='tmp/order.html';	
	document.body.appendChild(orderFrame);
	*/

});	