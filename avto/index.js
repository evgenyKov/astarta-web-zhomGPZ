const atpDelete = require('./atpDelete');
const atpEdit = require('./atpEdit');
const atpList = require('./atpList');
const avtoEdit = require('./avtoEdit');
const avtoList = require('./avtoList');
const avtoListPrivate = require('./avtoListPrivate');
const avtoTypeDelete = require('./avtoTypeDelete');
const avtoTypeEdit = require('./avtoTypeEdit');
const avtoTypeList = require('./avtoTypeList');
const drivers = require('./drivers');
const { getAvto } = require('./getAvto');
const { getTTN } = require('./getTTN');

module.exports = {
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
    getTTN,
}