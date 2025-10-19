import express from "express";
import { query, validationResult, body, matchedData,checkSchema } from "express-validator";
import {createnamevalidateSchema} from "./utils/validationSchemas.js";
import userRouter from "./routers/users.js"

const app = express();

app.use(express.json());
app.use(userRouter);

const customer = [
    { id: 1, name: 'Roushan', age: 23, value: 300 },
    { id: 2, name: 'shyam', age: 20, value: 500 },
    { id: 3, name: 'shubham', age: 12, value: 100 },
    { id: 4, name: 'raina', age: 40, value: 200 },
    { id: 5, name: 'suman', age: 30, value: 600 },
]

const resolvefinduserid = (req, res, next) => {
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

// ✅ Apply middleware only to routes that have :id
// app.use(resolvefinduserid)   // Global Middleware
app.use("/customer/:id", resolvefinduserid);  // MiddleWare on specific condition



// 🧠 Why two errors per field?
// It’s because each chain (isInt() + notEmpty()) adds its own validation context.
// That means express-validator runs:
// .isInt() → checks if it’s an integer
// .notEmpty() → checks if it’s not empty
// If both fail, you’ll see two messages per field — one from each rule.
// But in your case, even if both fail for the same field, express-validator shows both because there’s no .bail() in between.

app.get('/user', query("id").notEmpty().withMessage("id must be required").bail().isInt().withMessage("id must be an integer"), query("value").notEmpty().withMessage("value must be required").bail().isInt().withMessage("value must be an integer"), (req, res) => {
    //console.log(req["express-validator#contexts"]);
    const result = validationResult(req);

    //.isEmpty() → checks if there are no validation errors
    //✅ true → Everything is valid (no errors)
    // ❌ false → Some validations failed (errors exist)

    if (!result.isEmpty()) {
        // return res.status(400).send(error);
        return res.status(400).json({ error: result.array() });
    }

    console.log(req.query);
    const { query: { id, value } } = req;

    const filteruser = customer.filter((user) => Number(user.id) > Number(id) && Number(user.value) > Number(value));
    res.status(200).json(filteruser);
})

//by gpt correction
// app.get("/user",
//     [
//         query("id").notEmpty().withMessage("id must be required").isLength({max:3,min:1}).withMessage('must char more than 1').bail().isInt().withMessage("id must be an integer"),
//         query("value").notEmpty().withMessage("value must be required").isLength({max:10,min:3}).withMessage('must char more than 3').bail().isInt().withMessage("value must be an integer"),

//     ],
//     (req, res) => {
//         // ✅ 1️⃣ Collect validation errors
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             // Return proper JSON so frontend can parse it easily
//             return res.status(400).json({ errors: errors.array() });
//         }
//         // ✅ 2️⃣ Extract query params
//         const { id, value } = req.query;
//         // ✅ 3️⃣ Filter logic
//         const filteredUsers = customer.filter((user) => Number(user.id) > Number(id) && Number(user.value) > Number(value));
//         // ✅ 4️⃣ Send response
//         res.status(200).json(filteredUsers);
//     }
// );

app.post(
    '/customer', checkSchema(createnamevalidateSchema), // use instead of below
    // body("name")
    //     .notEmpty().withMessage("Name can't be empty")
    //     .isLength({ min: 5, max: 30 })
    //     .withMessage("Name must be in between 5 to 30 characters")
    //     .isString().withMessage('Name must be string'),
    (req, res) => {

        // validationResult(req) never returns false or null. It returns a Result object.
        // To check if there are validation errors, you must use .isEmpty():

        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ error: result.array() });
        }
        // const { body } = req;
        const data = matchedData(req);   // use this instead of const { body } = req;    data has only the parameter which you want to validate in this like name
        // console.log(data);
        // const newuser = { id: customer.length + 1, ...req.body };
        const newuser = { id: customer.length + 1, ...data };
        customer.push(newuser);
        return res.status(200).send({ newuser, customer })
    })


app.put('/customer/:id', (req, res) => {
    const { body } = req;
    const { finduserid, id } = req;
    const updatecustomer = { id, ...body };
    customer[finduserid] = updatecustomer
    res.status(200).send({ updatecustomer, customer });

})

app.patch('/customer/:id', (req, res) => {
    const { body } = req;
    const { finduserid } = req;
    //// Only update fields provided in the request body
    Object.assign(customer[finduserid], body);
    res.status(200).send(customer);
})

app.delete('/customer/:id', (req, res) => {
    const { finduserid } = req;
    const deleteuser = customer.splice(finduserid, 1);
    res.send({ deleteuser, customer });
    // splice returns an array of deleted items, so deleteuser[0] is the actual removed object.


})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is at : http://localhost:${PORT}`);
})