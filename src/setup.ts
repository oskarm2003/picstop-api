import { create_db } from "./model/database/database_model"

module.exports = async function () {

    await create_db('photos_test')

}