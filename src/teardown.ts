import { remove_db } from "./model/database/database_model"

module.exports = async function () {

    await remove_db('photos_test')

}