import axios from "axios"

export const Base_Url = "http://localhost:9091"
//  "https://proconnectbakend.onrender.com/"

 export const clientServer = axios.create({
    baseURL: Base_Url
})
