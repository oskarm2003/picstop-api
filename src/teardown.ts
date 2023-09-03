import { removeDB } from "./model/database/database_model"

module.exports = async function () {

    await removeDB('photos_test')

}