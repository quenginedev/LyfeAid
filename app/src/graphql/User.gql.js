import CrudGQL from './Crud.gql'
class User extends CrudGQL {
    constructor(){
        super('user')
    }

    async snapShot(node = `{id}`, options = {}, callback = ()=>{}, error = ()=>{}){
        try {
            let user = await this.findOne(node, options)
            callback(user)
            await this.subscribeToMore(node, options, callback, error)
            return user
        }catch (error) {
            throw error
        }
    }
}

export default new User()