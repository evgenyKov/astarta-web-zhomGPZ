// Перечисление зависимостей:
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config');


// Описание настроек:
const staticSiteOptions = {
//TODO - возможно еще другие настройки		
    portnum: config.httpPort, // слушать порт 8090
    maxAge: 1000 * 60 * 1 // хранить страницы в минут
};
	
const app = express();

app.set('views', './views')
app.set('view engine', 'jade')

// Подключение сессий:
app.use(session({
	secret: 'asTARTa',
	resave: false,
	saveUninitialized: true
    }
));

// Парсер запросов
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
//								 Роутинг
//

// 			-----------	Управление доступом -----------
const { checkAuthorityPage, checkAuthorityApi, params, login, logout, operatorList } = require('./auth');
app.get('/api/params', params);
app.get('/api/operator', operatorList);
app.post('/login.html', login);
app.get('/logout.html', logout);
app.get('/', checkAuthorityPage);
app.get('/index.html', checkAuthorityPage);


// 		-------------	Страницы -----------

//Данные для рендеринга

// helper
const renderPage = (req, res, page, title, addData) => {
	const { fio, pages, roles, badUser, testVarning } = req.session;
	const { year, zavodId, ttnOtpravitel, ttnPunct, ttnDozvolyv, ttnBuhgalter, printerSleep } = config;
	const data = {
		user: fio,
		menu: pages, 
		roles: roles.join(', '),
		year, 
		zavod: zavodId,
		ttnOtpravitel, 
		ttnPunct, 
		ttnDozvolyv, 
		ttnBuhgalter, 
		printerSleep,
		page,
		title,
		badUser: badUser? 'НЕВІРНИЙ ПАРОЛЬ' : '',
		testVarning,
	}
	res.render(page, data);	
}

const renderLoginPage = (req, res) => {
	const { badUser, testVarning } = req.session;
	const data	= {
		badPassword: badUser ? 'НЕВІРНИЙ ПАРОЛЬ' : '',
		testVarning,
	}
	res.render('login', data);
}

// Страница входа
app.get('/login.html', (req, res) => {
	renderLoginPage(req, res);
});	
	
// Страница автомобилей (водителей)
app.get('/avto.html', checkAuthorityPage, (req, res) => {
	renderPage(req, res, 'avto', 'ЖОМ. Водії');
});


// Тара
app.get('/tara.html', checkAuthorityPage, (req, res) => {	
	renderPage(req, res, 'tara', 'ЖОМ. Тара');			
});
app.get('/tarae.html', checkAuthorityPage, (req, res) => {	
	renderPage(req, res, 'tarae', 'ЖОМ. Тара');
});
	
// Брутто
app.get('/brutto.html', checkAuthorityPage, (req, res) => {	
	renderPage(req, res, 'brutto', 'ЖОМ. Брутто');			
});

	
// Реєстр
app.get('/report.html', checkAuthorityPage, (req, res) => {	
	renderPage(req, res, 'report', 'ЖОМ. Реєстр');			
});
const getPage = (name, title) => {
	app.get(`/${name}.html`, checkAuthorityPage, 
		(req, res) => {
		renderPage(req, res,name, title);
	});
	
}

getPage('admin', 'ЖОМ. Користувачі');
getPage('edit', 'ЖОМ. Зміна');

// 		-------------	API -----------
const {
		atpDelete,
		atpEdit,
		atpList,
		avtoEdit,
		avtoList,
		avtoListPrivate,
		avtoTypeDelete,
		avtoTypeEdit,
		avtoTypeList,
		drivers,
		getAvto,
		getTTN
	} = require('./avto');

//Список марок автомобилей
app.get('/api/avtoTypes', avtoTypeList);
app.post('/api/avtoTypes', checkAuthorityApi, avtoTypeEdit);
app.delete('/api/avtoTypes', checkAuthorityApi, avtoTypeDelete);

//Список АТП
app.get('/api/atp', atpList);
app.post('/api/atp',checkAuthorityApi, atpEdit);
app.delete('/api/atp',checkAuthorityApi, atpDelete);

//Список автомобилей
app.get('/api/avto', avtoList);
app.post('/api/avto', checkAuthorityApi, avtoEdit);
app.get('/api/privateavto', avtoListPrivate);
app.get('/api/drivers', drivers);

//Получение автомобиля. При необходимости копирование
app.get('/api/getAvto', getAvto);
app.get('/api/getTTN', getTTN);

const { barcode, bruttoVes, report, taraVes, source } = require('./data');

app.get('/api/source', source);
app.post('/api/tara', taraVes);
app.post('/api/brutto', bruttoVes);

// Отчет
app.get('/api/report', report);

// Штрих-код
app.use('/api/barcode', barcode);

//excel
const { reportXls } = require('./excel/xls');
app.get('/api/excelreport', reportXls);

const getSourceList = async () => {
	// Получение списка заводов
	const { readSource } = require('./pools');

	const { sqlServer: server, sqlBase, sqlUser: user, sqlPass: password } = config;

	const [ database, dbo ] = sqlBase.split('\.');

	await readSource({
		server,
		database,
		user,
		password
	});
}

getSourceList();

app.use(express.static(
    path.join(__dirname, 'static'),
    staticSiteOptions
)).listen(staticSiteOptions.portnum);

console.log(`SERVER START ON ${staticSiteOptions.portnum}`);
