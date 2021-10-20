 const mssql = require('mssql');
 
 const defaultConfig = {
     connectionTimeout: 300000,
     idleTimeoutMillis: 30000,
     requestTimeout: 300000,
     pool: {
         max: 10,
         min: 1,
         idleTimeoutMillis: 30000,
     },
 //           dateFormat: 'dmy', Потестировать
     options: {
             enableArithAbort: true,
     },
     trustServerCertificate: true,
 }
 

 /**
  * 
  * @param {string} sqlQuery 
  * @param {Objec} pool 
  * @returns {Array}
  */
 const execQuery = async (sqlQuery, pool) => {
     try {
         const request = pool.request();
         const result = await request.query(sqlQuery);
         return result.recordset
     } catch(e) {
         console.log(e);
         throw new Error(`Помилка виконання запиту ${sqlQuery}. ${e.message}`);
     }
 }
 
 /**
  * 
  * @param {string} procname 
  * @param {Array} params 
  * @param {Object} pool 
  * @returns {Object}
  */
 const execProcedure = async (procname, params, pool) => {
     const paramTypes = {
         "NVarChar" : mssql.NVarChar,
         "Int": mssql.Int,
         "Bit": mssql.Bit,
         "DateTime": mssql.DateTime
     }
 
     try { 
         const request = pool.request()
         params.map(param => {
             const type = paramTypes[param.type || "NVarChar"]
             if (!type)
                 throw new Error(`Bad parameter type ${param.type} in procedure ${procname}`)
             if (param.isOutput)
                 request.output(param.name, type)
             else
                 request.input(param.name, type, param.value)
             })
         const result = await request.execute(procname)
         return result
     } catch(e) {
         console.log(e);
         throw new Error(`Помилка виконання процедури ${procname}. ${e.message}`)
     }
 }
 
const config = require('./config');

const { sqlServer, sqlBase, sqlUser, sqlPass } = config;
const [ database ] = sqlBase.split('\.');
const pool = new mssql.ConnectionPool({
    server: sqlServer,
    database,
    user: sqlUser,
    password: sqlPass,
    ...defaultConfig
});
let SOURCES = { 'main': { pool: pool }}; 

const readSource = async (mainServerConfig) => {
    const mainPool = SOURCES['main'].pool;
    await mainPool.connect()
    const sqltext = `
        SELECT id, name, host AS server, directCopy, [database]
        FROM dbo.Source 
        ORDER BY name`;
    const sourceList = await execQuery(sqltext, mainPool);
    sourceList.map( source => {
        const { server,database, id } = source;
        source.pool = new mssql.ConnectionPool({
            server,
            database,
            user: sqlUser,
            password: sqlPass,
            ...defaultConfig
        });
        source.pool.connect();
        SOURCES[id] = source;
    })
}

const sourceList = () => SOURCES;
const mainConnection = () => SOURCES['main'].pool;

 module.exports = { readSource, execQuery, execProcedure, sourceList, mainConnection, sqlBase };
 