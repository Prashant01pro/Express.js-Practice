import { customer } from "./constants.js";
export const resolvefinduserid = (req, res, next) => {
    const id = parseInt(req.params.id)
    const finduserid = customer.findIndex((user) => user.id === id);
    if (isNaN(id)) {
        return res.status(400).send('Bad Request');
    }
    // 3️⃣ Check if user exists
    if (finduserid === -1) {
        return res.status(404).send('User not found');
    }
    // ✅ Store values in req object to use later
    req.finduserid = finduserid;
    req.id = id;
    next();
}
