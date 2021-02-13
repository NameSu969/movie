//引入axios
import axios from 'axios';
//创建实例
const http = axios.create({
    baseURL: 'https://m.maizuo.com',
    headers: {
        'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"16077035111718717062840321"}',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZ2VudElkIjoiMzAwMCIsInRpbWVzdGFtcCI6MTYwODg5NjgzMSwidXNlcklkIjozMTMwNTY0Mn0.9k__j-Nz1P-eNZpUPg-4RUsA279JplnrgYRBRmJYYks'
    }
})

//导出
export default http