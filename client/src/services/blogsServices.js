import api from './api'

const blogServices = {
    create(data){
        return api().post('blogs', data)
    },
    index(sort){
        return api().get(`blogs/posts${sort ? sort : '' }`)
    },
    post(id){
        return api().get(`blogs/${id}`)
    },
    delete(id){
        return api().delete(`blogs/${id}`)
    }
}


export default blogServices