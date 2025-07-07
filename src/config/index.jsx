import axios from "axios"

export const Base_Url =   
 "https://proconnectbakend.onrender.com/"
"http://localhost:9091" 



 export const clientServer = axios.create({
    baseURL: Base_Url
})
