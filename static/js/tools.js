$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

const useNameFieldAsText = (item) => item.name;
	
const m = [""];
const w = [""];
var do20 = [""];
var des = [""];
var sot = [""];
var tys = [""];	
	
m[1] = "один";
m[2] = "два";
m[3] = "три";
m[4] = "чотири";
m[5] = "п'ять";
m[6] = "шість";
m[7] = "сім";
m[8] = "дев'ять";
m[9] = "девять";
m[10] = "десять";

w[1] = "одна";
w[2] = "дві";
w[3] = "три";
w[4] = "чотири";
w[5] = "п'ять";
w[6] = "шість";
w[7] = "сім";
w[8] = "вісім";
w[9] = "дев'ять";
w[10] = "десять";

do20[11] = "одинадцять";
do20[12] = "дванадцять";
do20[13] = "тринадцять";
do20[14] = "чотирнадцять";
do20[15] = "п'ятнадцять";
do20[16] = "шістнадцять";
do20[17] = "сімнадцять";
do20[18] = "вісімнадцять";
do20[19] = "дев'ятнадцять";


des[2] = "двадцять";
des[3] = "тридцять";
des[4] = "сорок";
des[5] = "п'ятдесят";
des[6] = "шістдесят";
des[7] = "сімдесят";
des[8] = "вісімдесят";
des[9] = "дев'яносто";

sot[1] = "сто";
sot[2] = "двісті";
sot[3] = "триста";
sot[4] = "чотириста";
sot[5] = "п'ятсот";
sot[6] = "шістсот";
sot[7] = "сімсот";
sot[8] = "вісімсот";
sot[9] = "дев'ятьсот";

tys[1] = "тисяча"; // 1
tys[2] = "тисячі"; // 2, 3, 4
tys[3] = "тисяч"; // >4


/*
const sumProp = (sum) => {
	const gr	=	Math.floor(sum);
	const kop =	((sum - gr)*100).toFixed(0);
	const ziphers = String(gr).split('').reverse();
	console.log(ziphers);
} 
*/

const getFio = (fullName) => {
	const nameComponents =	(fullName || '').split(/\s+/).map((nameComponent, index) => {
		if (index === 0) {
			return `${nameComponent} `
		} else {
			return `${nameComponent.substr(0,1)}.`
		}
	})
	return nameComponents.join(''); 
}

const clientSelect2Config = {
	dropdownCssClass: 'ui-dialog' ,
	placeholder: 'Введіть код ЄДРПОУ або назву',
	allowClear: true,
	width: 300,
	minimumInputLength: 4,
	query: (query) => {
		const data =  { results: [] };
		$.getJSON("/api/client?search=" + encodeURIComponent(query.term),
			(res) => {
				data.results = res.list.map( item => ({
					id:			item.id, 
					text:		item.name,
					targetPunct:item.targetPunct,
					edrpou:		item.edrpou,
				})
			);
			query.callback(data);
		})
	}
}
	
const getFormatDate = (currDate, predefinedDay) => {
	const date = currDate || new Date();
	const [day, month] = [ predefinedDay || date.getDate(), date.getMonth() + 1 ].map(item => `0${item}`.substr(-2))
	return 	`${date.getFullYear()}-${month}-${day}`;
}

const formatSumma = (str) => str.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');

const zhomTypes = [
	{ id:1, text: "Свіжий жом" },
	{ id:2, text: "Кислий жом" },
	{ id:3, text: "Пресований жом" },
];