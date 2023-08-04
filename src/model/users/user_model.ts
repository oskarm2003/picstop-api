type t_user = { username: string, email: string, password?: string }

//get all users' data from the database
function get_all_users(): Array<t_user> {

    let output: Array<t_user> = []
    //TODO: database code here
    return output

}

function create_user(): boolean {

    //TODO: register handling
    return false

}

export { get_all_users, create_user }