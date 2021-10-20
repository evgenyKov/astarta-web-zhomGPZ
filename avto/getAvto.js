const { sourceList, execQuery, execProcedure } = require('../pools');

const copyAvto = async (id, source, pool, mainPool) => {
    const  sqltext = `
        SELECT *
        FROM AvtoExt_View 
        WHERE avtoOriginalId=${id} AND avtoSourceId=${source}`; 
    let avtoExist = await execQuery(sqltext, mainPool);
    if (avtoExist.length > 0) {
        avtoExist[0].message = 'Автомобіль вже зареєстрований';
        res.send(JSON.stringify(avtoExist[0]))
        return;
    }

    const avtoList = await execQuery(`SELECT * FROM dbo.Avto WHERE id=${id}`, pool);
    if (avtoList.length === 0) {
        throw new Error(`Автомобіль з ідентифікатором ${id} в БД заводу не знайдено`)
    }
    const avtoInfo = avtoList[0];

    let atpId;
    let typeAvtoId;

    // Проверяем наличие АТР в базе
    const atpExist = await execQuery(`SELECT id FROM ATP WHERE originalId = ${avtoInfo.atpId} AND sourceId=${source}`, mainPool);
    if (atpExist.length === 0 ) { // Нет такого АТП, считываем инфо про АТП из оригинальной базы и добавлям его
        const atpOriginal = await execQuery(`SELECT name, fullname, edrpou, id FROM ATP WHERE Id = ${avtoInfo.atpId}`, pool);
        if (atpOriginal.length === 0) {
            throw new Error('ATP not found')
        }
        const { name, fullname, edrpou, id: originalId } = atpOriginal[0];
        const params = [
            { name: 'name', value: name},
            { name: 'fullname', value: fullname},
            { name: 'edrpou', value: edrpou},
            { name: 'id', value: 0, type: 'Int'},
            { name: 'originalId', value: originalId, type: 'Int'},
            { name: 'sourceId', value: source, type: 'Int'},
        ];
        const result = await execProcedure('UPD_ATP', params, mainPool);
        atpId = result.returnValue;
    } else {
        atpId = atpExist[0].id;
    }

    //Проверяем наличие АvtoType в базе
    const avtoTypeExist = await execQuery(`SELECT id FROM AvtoType WHERE originalId = ${avtoInfo.avtoTypeId} AND sourceId=${source}`, mainPool);
    if (avtoTypeExist.length === 0 ) { // Нет такого типа авто, считываем инфо про тип авто из оригинальной базы и добавлям его
        const atpTypeOriginal = await execQuery(`SELECT name, id FROM avtoType WHERE Id = ${avtoInfo.avtoTypeId}`, pool);
        if (atpTypeOriginal.length === 0) {
            throw new Error(`Avto type ${avtoInfo.avtoTypeId} not found`)
        }
        const { name, id: originalId } = atpTypeOriginal[0];
        const params = [
            { name: 'name', value: name},
            { name: 'id', value: 0, type: 'Int'},
            { name: 'originalId', value: originalId, type: 'Int'},
            { name: 'sourceId', value: source, type: 'Int'},
        ];
        const result = await execProcedure('UPD_AvtoType', params, mainPool);
        avtoTypeId = result.returnValue;
    } else {
        avtoTypeId = avtoTypeExist[0].id;
    }
    // Копируем автомобиль
    const { id: originalId, firstName, middleName, lastName, nomer, trailer, drivingPermit } = avtoInfo;
    const params = [
        { name: 'avtoId', value:0, type: 'Int'},
        { name: 'firstName', value: firstName },
        { name: 'middleName', value: middleName },
        { name: 'lastName', value: lastName },
        { name: 'avtoTypeId', value: avtoTypeId , type: 'Int'},
        { name: 'atpId', value: atpId , type: 'Int'},
        { name: 'nomer', value: nomer },
        { name: 'trailer', value: trailer },
        { name: 'drivingPermit', value: drivingPermit },
        { name: 'originalId', value: id , type: 'Int'},
        { name: 'sourceId', value: source , type: 'Int'},
    ]
    const result = await execProcedure('UPD_Avto', params, mainPool);
    const avtoId = result.returnValue;

    avtoExist = await execQuery(sqltext, mainPool);
    if (avtoExist.length === 0) {
        throw new Error(`Не вдалось скопіювати дані по автомобілю ${avtoId}`);
    }
    avtoExist[0].message = `Дані про автомобіль скопійовано. Ідентифікатор ${avtoId}`;
    return avtoExist[0];
}

const getAvto = async (req, res) => {
    const { id, source } = req.query;
    const SOURCES = sourceList();
    const mainPool = SOURCES['main'].pool;
    const pool = SOURCES[source].pool;

    try {
        const data = await copyAvto(id, source, pool, mainPool);
        res.send(data);
    } catch (e) {
        const { message } = e
        res.status(500);
        res.send({ message});
    }
  
}

module.exports = { getAvto, copyAvto };

/*
9511110084821
@fullname,
@edrpou,
@id	int,
@sourceId int,
@originalId Int
*/