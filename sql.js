var tedious = require('tedious');
const { sqlUser, sqlPass, sqlServer, sqlBase } = require('./config');

const ConnectionPool = require('tedious-connection-pool');
const Request = tedious.Request;

const connectionConfig = {
	userName: sqlUser,
	password: sqlPass,
	server: sqlServer,
	options: {
			requestTimeout: 30000,
			rowCollectionOnDone: true
	}
};
const poolConfig = {
	max: 10,
	min : 0,
	idleTimeoutMillis : 30000
};	
const pool = new ConnectionPool(poolConfig, connectionConfig);

pool.on('error', function(err) {
    console.error("Pool error " + err);
	});

const createBetweenStr = (from, to) => {	
	const getFirstMonthDay = () => {
		const currDate = new Date();
		const year = currDate.getFullYear();
		const month = currDate.getMonth() + 1;
		return `${year}-${('0' + month).substr(-2)}-01`
	}	
	
	let fromDate = from;
	let toDate = to;
	if (!from && !to) {
		fromDate	= 	getFirstMonthDay();
		toDate		= 	'2099-12-12';
		}
	if (!from && to) {
		fromDate	= 	'2016-01-01';
	}
		
	if (from && !to) {
		to		= 	'2099-12-12';
	}
	return 	` BETWEEN '${fromDate}' AND '${toDate}'`;
}
	
const querySQL = (res, sqltext, items, rowcallback, rowcountcallback) => {
	pool.acquire((err, connection) => {
		if (err) {
			console.error(err);
			connection.release();
			return;
		}
		const request = new Request(sqltext, (err, rowCount) => {
			if (err) {
				console.error(err);
			} else {	
				if (rowcountcallback) {
					rowcountcallback(res, rowCount)
				} else {
					res.send(JSON.stringify(items));	
				}
			}
			connection.release();
		});
 
		request.on('row', columns => {
			rowcallback(columns);
		});
		
		connection.execSql(request);
	})	
}
	
const execStoreProc = (res, proc, params, returnValueHandler ) => {
	pool.acquire( (err, connection) => {
		if (err) {
			console.error(err);
			connection.release();
			return;
		}
		const request = new Request(proc, (err, rowCount) => {
			if (err) {
				res.send(JSON.stringify({success: false, err: err.message}));
			} else {
				console.log("EXEC SUCCESS");
				if (!returnValueHandler)
					res.send(JSON.stringify({success: true}));
			}	
			connection.release();	
		});

		const TYPES = require('tedious').TYPES;
		for (let i in params)	{
			const [paramName, paramType, paramValue] = params[i];
			request.addParameter(paramName, TYPES[paramType], paramValue);
		}
		request.on('doneProc', function (rowCount, more, returnStatus, rows) { 
			if (returnValueHandler) {
				returnValueHandler(returnStatus, res);
			}
		});
		connection.callProcedure(request);
	})			
}
	
const execStoreProc1 = (res, proc, params, rowCallback, fail) => {
	pool.acquire((err, connection) => {
		const rowsData = [];			
		if (err) {
			console.error(err);			
			return;
		}
		var request = new Request(proc, (err,rowCount) => {
			if (err) {
				console.error(err);			
				if (fail) {
					fail(err)
				} else {
					res.send(JSON.stringify({success: false, err: err}));	
				}
				connection.release();					
			}	
		});
		var TYPES = require('tedious').TYPES;
		for (var i in params)	{
			const param = params[i];
			request.addParameter(param[0],TYPES[param[1]], param[2]);
		}
			
		request.on('doneInProc', (rowCount, more, rows) => { 
			if (rowCallback) {
				rowCallback(rows, rowsData)	
			} else {	
				for (let i=0; i < rows.length; i++) {
					const row=rows[i];
					const columns = {};
					for	(let j=0; j < row.length; j++) {
						columns[row[j].metadata.colName] = row[j].value;
					}
					rowsData.push(columns);
				}
			}
		});	

		request.on('doneProc', (rowCount, more, returnStatus, rows) => {
			resp = {
				success: (returnStatus <= 0),
				ret: returnStatus,
				list: rowsData
			}
			res.send(JSON.stringify(resp));
//			connection.release();
		});
		connection.callProcedure(request);
	})			
}	
	
const dataToExcel = (res, sqltext, descr, rowcallback, name, foother) => {

//	name = name || 	descr.name || 'Звіт';
	name = 'Report'; // ????
	pool.acquire( (err, connection) => {
		if (err) {
			console.error(err);
			return;
		}
		const request = new Request(sqltext, (err, rowCount) => {
			if (err) {
				console.error(err);
			} else {
				const excel	=	require('node-excel-export');
				if (foother) {
					foother(descr.data);
				}
				const report = excel.buildExport(
					[descr]
				);
					
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=" + name + ".xlsx");
				res.end(report, 'binary');		
			}		
			connection.release();
		});
 
		request.on('row', function(columns) {
			rowcallback(columns);
		});
		connection.execSql(request);
	})	
}	


const safeTrim = (column, def) => {	
	if (!column) {
		return '';
	}
	const val = column.value;
	if (def === undefined ) {
		if (val && val.trim) {
			return (val)? val.trim() : '';
		}
		return val;
	}
	return val? val : def;
}


//Заглушка для взвешивания
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

module.exports = { safeTrim, sqlBase, createBetweenStr, querySQL, execStoreProc, execStoreProc1, dataToExcel, getRandomInt }