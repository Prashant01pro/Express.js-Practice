import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { customer } from "../utils/constants.js";
import { createnamevalidateSchema } from "../utils/validationSchemas.js";
import { resolvefinduserid } from "../utils/middlewares.js";

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


router.post(
    '/customer', checkSchema(createnamevalidateSchema),
    (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ error: result.array() });
        }
        // const data = matchedData(req);   // use this instead of const { body } = req;    data has only the parameter which you want to validate in this like name
        // const newuser = { id: customer.length + 1, ...data };
        const newuser = { id: customer.length + 1, ...req.body };
        customer.push(newuser);
        return res.status(200).send({ newuser, customer })
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