import api from './api'

const services = {
    register(credential){
        return api().post('users', credential)
    },
    login(credential){
        return api().post('users/login', credential)
    },
    logout(){
        return api().post('users/logout')
    },
    update(data){
        return api().patch('users/edit', data)
    },
    remove(){
        return api().delete('users/delete')
    },
    activate(id){
        return api().patch(`users/activate/${id}`)
    },
    promote(id){
        return api().patch(`users/promote/${id}`)
    },
    removeById(id){
        return api().delete(`users/remove/${id}`)
    },
    index(sort){
        return api().get(`users/all${sort ? sort : '' }`)
    },
    resetPassLink(email){
        return api().post('users/reset-passLink', email)
    },
    resetPassword(credential){
        return api().post('users/reset-password', credential)
    }
}

export default services