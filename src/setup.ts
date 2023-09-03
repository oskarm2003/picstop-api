import { createDB } from "./model/database/database_model"

module.exports = async function () {

    await createDB('photos_test')

}