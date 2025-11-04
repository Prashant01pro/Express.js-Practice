import { customer } from "../utils/constants.js";

 
 export const getuserbyidhandler=(req, res) => {
    const { finduserid } = req;
    const finduser = customer[finduserid];
    if (!finduser) return res.sendStatus(404);
    return res.send(finduser);
}