import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { customer } from "../utils/constants.js";
import { createnamevalidateSchema } from "../utils/validationSchemas.js";
import { resolvefinduserid } from "../utils/middlewares.js";
import { User } from "../mongoose/schemas/user.js";
import { hashPassword } from "../utils/helper.js";

const router = Router();
router.use("/customer/:id", resolvefinduserid);  // MiddleWare on specific condition


router.get('/user', query("id").notEmpty().withMessage("id must be required").bail().isInt().withMessage("id must be an integer"), query("value").notEmpty().withMessage("value must be required").bail().isInt().withMessage("value must be an integer"), (req, res) => {
    console.log(req.session);
    console.log(req.session.id)
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log("inside session store get");
        console.log(sessionData);
    })

    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ error: result.array() });
    }

    console.log(req.query);
    const { query: { id, value } } = req;
    const filteruser = customer.filter((user) => Number(user.id) > Number(id) && Number(user.value) > Number(value));
    res.status(200).json(filteruser);
});


router.post('/customer', checkSchema(createnamevalidateSchema), async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array())
    const data = matchedData(req);
    console.log(data);
    // const { body } = req;

    data.password = hashPassword(data.password);
    console.log(data);
    const newuser = new User(data);
    try {
        const saveuser = await newuser.save();
        return res.status(201).send(saveuser)
    } catch (err) {
        console.log(err);
        return res.sendStatus(400);
    }
})


router.put('/customer/:id', (req, res) => {
    const { body } = req;
    const { finduserid, id } = req;
    const updatecustomer = { id, ...body };
    customer[finduserid] = updatecustomer
    res.status(200).send({ updatecustomer, customer });
})


router.patch('/customer/:id', (req, res) => {
    const { body } = req;
    const { finduserid } = req;
    Object.assign(customer[finduserid], body);
    res.status(200).send(customer);
})

router.delete('/customer/:id', (req, res) => {
    const { finduserid } = req;
    const deleteuser = customer.splice(finduserid, 1);
    res.send({ deleteuser, customer });
    // splice returns an array of deleted items, so deleteuser[0] is the actual removed object.
})

export default router;  