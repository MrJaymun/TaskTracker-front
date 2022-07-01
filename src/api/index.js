import api from "axios"


const Api  = api.create({
    baseURL: "https://localhost:44338",
    headers: {
        accept: 'applications/json'
    }

});


export default Api;