exports.zavodName='Глобинський біоенергетичний комплекс';
exports.host = 'loaclhost';
exports.httpPort=8080;

exports.sqlServer = "localhost";
exports.sqlBase = "Zhom_GBK.dbo";

//exports.sqlUser = "test";
//exports.sqlPass = "Astarta123";
exports.sqlUser='sa';
exports.sqlPass='EdnjhytUM19%(';

//exports.taraIP = '172.24.4.88';
exports.taraIP = '172.24.4.90';

exports.taraPort = 23;
//exports.taraInit="S99;";
//exports.taraCommand = 'MSV?;';
exports.taraInit="";
exports.taraCommand = 'G01W' + String.fromCharCode(13) + String.fromCharCode(10);


//exports.bruttoIP = '172.24.4.88';
exports.bruttoIP = '172.24.4.90';
exports.bruttoPort = 23;
//exports.bruttoInit="S99;";
//exports.bruttoCommand = 'MSV?;';
exports.bruttoCommand = 'MSV?;';
exports.bruttoInit='G01W' + String.fromCharCode(13) + String.fromCharCode(10);

exports.printerSleep 	=	5000;

exports.fakeBrutto = true;
exports.fakeTara = true;

//exports.taraGetVes = dataStr => dataStr.split(',')[0];
//exports.taraGetVes = dataStr => dataStr.split(',')[0];
exports.taraGetVes = dataStr => dataStr.substr(4).replace(String.fromCharCode(13) + String.fromCharCode(10), '');
exports.bruttoGetVes = dataStr => dataStr.substr(4).replace(String.fromCharCode(13) + String.fromCharCode(10), '');

exports.taraKoeff = 1000;
exports.bruttoKoeff = 1000;