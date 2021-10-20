const { execQuery, execProcedure, readSource, sourceList } = require('./pools');
const { copyAvto } = require('./avto/getAvto');
const { copyTTN } = require('./avto/getTTN');
const admin = 4;


const loadData = async (sourceId ) => {

    const { sqlServer: server, sqlBase, sqlUser: user, sqlPass: password } = require('./config');
    const [ database, dbo ] = sqlBase.split('\.');
    await readSource({
        server,
        database,
        user,
        password
    });

    const SOURCES = sourceList();
    const mainPool = SOURCES['main'].pool;
    const pool = SOURCES[sourceId].pool;
    let connectedPool = pool;
    if (!pool._connected) {
        connectedPool = await pool.connect();
    }

    await execQuery('DELETE FROM Avto', mainPool);
    await execQuery('DELETE FROM AvtoType', mainPool);
    await execQuery('DELETE FROM ATP', mainPool);
    await execQuery('DELETE FROM Brutto', mainPool);
    await execQuery('DELETE FROM Tara', mainPool);
    await execQuery('UPDATE brutto SET copied = NULL', connectedPool);
    console.log('База очищена');
    const sources = await execQuery(`SELECT gbkId FROM Source WHERE id=${sourceId}`, mainPool);
    const gbkId = sources[0].gbkId;
    const avtoList = await execQuery(`SELECT DISTINCT avtoId from BruttoExt_View WHERE clientId=${gbkId}`, connectedPool);
    for (let i=0; i < avtoList.length; i++) {
        const avtoId = avtoList[i].avtoId;
        await copyAvto(avtoId, sourceId, connectedPool, mainPool);
        console.log("====copy==avto", avtoList[i].avtoId);
        const ttnList = await execQuery(`SELECT bruttoId AS bruttoOriginalId, brutto, nomerttn, bruttoD FROM BruttoExt_View WHERE avtoId=${avtoId} AND clientId=${gbkId}`, connectedPool);
        for (let j =  0; j < ttnList.length; j++) {
            const ttnInfo = ttnList[j];
            await copyTTN(admin, avtoId, sourceId, ttnInfo, connectedPool, mainPool )
            console.log("=====copy===TTN", ttnInfo.nomerttn)
        }
    }

}

const sourceId = '1';

loadData(sourceId);
