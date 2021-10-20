const { sourceList, execQuery, execProcedure } = require('../pools');

const copyTTN = async(operatorId, avtoOriginalId, sourceId, bruttoInfo, pool, mainPool) => {

    const { bruttoOriginalId, brutto, nomerttn, bruttoD } = bruttoInfo;

    const avtoList = await execQuery(`SELECT id FROM dbo.Avto_View WHERE originalId=${avtoOriginalId} AND sourceId=${sourceId}`, mainPool);
    if (avtoList.length === 0) {
        throw new Error(`Не знайдено автомобіль з originalId=${avtoOriginalId},sourceId=${sourceId} в головній БД`)
    }
    const avtoId = avtoList[0].id;
    const paramsBrutto = [
        { name: 'originalId', value: bruttoOriginalId, type: 'Int'},
        { name: 'sourceId', value: sourceId, type: 'Int'},
        { name: 'avtoId', value: avtoId, type: 'Int'},
        { name: 'avtoOriginalId', value: avtoOriginalId, type: 'Int'},
        { name: 'operatorId', value: operatorId, type: 'Int'},
        { name: 'nomerTTN', value: nomerttn, type: 'Int'},
        { name: 'brutto', value: brutto, type: 'Int'},
        { name: 'createDate', value: bruttoD, type: 'DateTime'},
    ]

    const resultBrutto = await execProcedure('Copy_Brutto', paramsBrutto, mainPool);
    const bruttoId = resultBrutto.returnValue;

    if (bruttoId < 0) {
        throw new Error(`Помилка при вставці брутто ${bruttoId}`);
    }

    const taraSqltext = `SELECT TOP 1 id AS taraOriginalId, tara, date AS taraD FROM Tara_View WHERE nomerTTN=${nomerttn}` 
    const taraExist = await execQuery(taraSqltext, pool);
    if (taraExist.length === 0) {
        throw new Error(`Не найдена тара з номером ТТН ${nomerTTN}`);
    }
    
    const { taraOriginalId, tara, taraD } = taraExist[0];
        
    const paramsTara = [
        { name: 'bruttoId', value: bruttoId, type: 'Int'},
        { name: 'tara', value: tara, type: 'Int'},
        { name: 'operatorId', value: operatorId, type: 'Int'},
        { name: 'avtoId', value: avtoId, type: 'Int'},
        { name: 'originalId', value: taraOriginalId, type: 'Int'},
        { name: 'sourceId', value: sourceId, type: 'Int'},
        { name: 'createDate', value: taraD, type: 'DateTime'},
    ]

    const resultTara = await execProcedure('Copy_Tara', paramsTara, mainPool);
    const taraId = resultTara.returnValue;

    await execQuery(`UPDATE Brutto SET copied=1 WHERE id=${bruttoOriginalId}`, pool)

    return resultTara.recordset
}

const getTTN = async (req, res) => {
    const { id: avtoOriginalId, source: sourceId, gbk } = req.query;
    const SOURCES = sourceList();
    const mainPool = SOURCES['main'].pool;
    const pool = SOURCES[sourceId].pool;
    const operatorId = req.session.user_id;
    try {
        const bruttoSqltext = `SELECT TOP 1 bruttoId AS bruttoOriginalId, brutto, nomerttn, bruttoD FROM BruttoExt_View where clientId=${gbk} AND copied IS NULL
        AND avtoId=${avtoOriginalId}`
        const bruttoExist = await execQuery(bruttoSqltext, pool);
        if (bruttoExist.length === 0) {
            throw new Error(`Автомобіль з ідентифікатором ${avtoOriginalId} не має нескопійованих ТТН`)
        }

        const data = await copyTTN(operatorId, avtoOriginalId, sourceId, bruttoExist[0], pool, mainPool);
        res.send(data);

    } catch (e) {
        const { message } = e
        res.status(500);
        res.send({ message});
    }
  
}

module.exports = { getTTN, copyTTN };

/*
9511110088161
@fullname,
@edrpou,
@id	int,
@sourceId int,
@originalId Int
*/