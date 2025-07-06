import axios from "axios"

export const Base_Url = 
 "https://proconnectbakend.onrender.com/"

 export const clientServer = axios.create({
    baseURL: Base_Url
})
