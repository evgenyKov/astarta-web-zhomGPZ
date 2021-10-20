const setExcelLink = (sortBy) => {
	const queryString = generateQueryString(sortBy);
	w2ui["reportGrid"].header = `<a id="excel" href="api/excelreport${queryString}">РЕЄСТР ВІДПУСКУ ЖОМУ</a>&nbsp;&nbsp;&nbsp;`;
}
	
const generateQueryString = (sortByField) => {
	const keys = ["source", "ttn", "from","to", "atp", "driver"];
	const queries =	[];
	keys.map(key => {
		const val = getValue(key);
		if (val) {
			queries.push(`${key}=${val}`);
		}
	})
	
	if (sortByField) {
		let direction;
		const oldField = w2ui["reportGrid"].sortData[0].field;
		if (oldField != sortByField)
			direction = "asc"
		else
			direction = (w2ui["reportGrid"].sortData[0].direction == "asc")? "desc" : "asc";
		
		queries.push(`field=${sortByField}`);
		queries.push(`direction=${direction}`);
	}
	return queries.length > 0 ? `?${queries.join("&")}` : '';
}

const reloadGrid = () => {
	const queryString = generateQueryString();
	w2ui["reportGrid"].url = `api/report${queryString}`;
	w2ui["reportGrid"].reload();
	setExcelLink();
}

const reportConfig = {
	url:	'/api/report',	
	name:	'reportGrid',
	header:	'<a id="excel" href="api/excelreport">РЕЄСТР ВІДПУСКУ ЖОМУ</a>&nbsp;&nbsp;&nbsp;',
	method:	'GET',
	show: {
		header: true,
		footer: true
	},
 	columns: [
		{field: 'acceptDate', caption: 'Дата', size: '14%', sortable: true},
		{field: 'nomerTTN', caption: '№ ТТН', size: '13%', sortable: true},
		{field: 'sourceName', caption: 'Постачальник', size: '20%', sortable: true},
		{field: 'netto', caption: 'Фізична вага', size: '13%', sortable: true},
		{field: 'atpName', caption: 'АТП', size: '20%', sortable: true},        
		{field: 'driver', caption: 'Водій', size: '20%', sortable: true},
    ],
		
	sortData: [
		{field: 'acceptDate', direction: 'desc'}
    ],

	onLoad: function (event) {
		const resp = $.parseJSON(event.xhr.responseText);
		event.xhr.responseText = getReportRecords(resp);
    },
	onSort: function (event) {
//		dir = (w2ui["reportGrid"].sortData[0].field == event.field) ? 'asc' : 'desc';
		setExcelLink(event.field);
    },

	onDblClick: function(e) {
		var ttnData = w2ui["reportGrid"].records[e.recid];
		$.getJSON("/api/ttn?ttn=" + ttnData.nomerTTN + "&ordertype=" + ttnData.orderType, function(response)
//		$.getJSON("/api/ttn?ttn=" + ttnData.nomerTTN, function(response)
			{
			showTTNInfo(response.list[0]);	
			$("#showTTN").modal("show");
			}
			)	
		}
    }

	
const getReportRecords = (resp) => {
	let	netto = 0;
    w2ui["reportGrid"].records = [];

    if (!w2ui["reportGrid"].records) {
       w2ui["reportGrid"].records = [];
    }

    const records = w2ui["reportGrid"].records = resp.map( (item, index) => {
            item.recid = index;
            item.netto = (item.netto/1000).toFixed(2);
            netto += +item.netto;
            return item;            
        }
    );

//    w2ui["reportGrid"].records = w2ui["reportGrid"].records.concat(records);
    w2ui["reportGrid"].total = resp.total;	
}
	
$(document).ready( () => {	
	const currentDate = new Date();

	$("#from").datepicker({ "setDate": new Date(), todayHighlight: true }).on("change", 
		() => reloadGrid()
	);

	$("#to").datepicker({ "setDate": currentDate, todayHighlight: true, autoclose: true }).on("change", 
		() => reloadGrid()
	);
	
	$("#ttn").on("keyup", 
        () => reloadGrid() 
	);

	$.getJSON("/api/source", (source) => {
		$("#source").select2({
			data: source.list,
			allowClear: true,	
		})
		.on('change', 
            () => reloadGrid() 
		);		
	})

	$.getJSON("/api/drivers", (source) => {
		$("#driver").select2({
			data: source,
			allowClear: true,	
		})
		.on('change', 
            () => reloadGrid() 
		);		
	})

	$.getJSON("/api/atp", (source) => {
        console.log("===SOURCE", source.list)
		$("#atp").select2({
			data: source.list.map(item => {
                item.text = item.name;
                return item;
            }),
			allowClear: true,	
		})
		.on('change', 
            () => reloadGrid() 
		);		
	})

/*
	$("#driver").select2({
		allowClear: true,
		placeholder: "Автомобіль",
		ajax: {
			url: '/api/drivers',
			dataType: 'json',
            data: function (term) {
				return {
					term: term
				};
			},
    		delay: 250,
		    results: data => data
		},
		minimumInputLength: 3,
	})
	.on("change", 
		() => reloadGrid()
	);


	$("#atp").select2({
		allowClear: true,
		placeholder: "Перевізник",
		ajax: {
			url: '/api/atp',
			dataType: 'json',
			data: function (term) {
				return {
					term: term
				};
			},
			delay: 250,
			results: data => data
		},
		minimumInputLength: 3,
	})
	.on("change", 
		() => reloadGrid()
	);
*/		
		
	$("#report").w2grid(reportConfig);
})
