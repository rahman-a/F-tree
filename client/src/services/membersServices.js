import api from './api'

const services = {
    uploadCSV(csv) {
        return api().post('members/upload-csv', csv)
    },
    addRelatives(info){
        return api().patch('members/relatives', info)
    },
    generateCSV(count){
        return api().get(`members/generate-csv/${count}`)
    },
    importTreeData(){
        return api().get('members/import-data')
    },
    info(id){
        return api().get(`members/${id}`)
    },
    uploadImg(memberId){
        return api().post(`members/photo`, memberId)
    },
    getAvatar(id){
        return api().get(`members/avatar/${id}`)
    },
    index(sort){
        return api().get(`members/all${sort ? sort : '' }`)
    },
    convertToPNG(svg) {
        return api().post('members/convertSvgToPng', {svg})
    },
    convertToPDF(svg) {
        return api().post('members/convertSvgToPdf', {svg})
    },
    generatePDF() {
        return api().get('members/getPdfFile')
    },
    getCSVData(){
        return api().get('members/export-csv')
    },
    edit(info) {
        return api().patch('members/edit', info)
    },
    create(info) {
        return api().post('members/new', info)
    }
}


export default services