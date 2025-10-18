import express from "express";

const app = express();

app.use(express.json());

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
app.use("/customer/:id", resolvefinduserid);

// app.use(resolvefinduserid)

app.get('/', (req, res) => {
    res.send('Server is Running');
});


// 🎯 Scoped Middleware (Path-Specific Middleware)
// You can restrict middleware to run only for specific routes like this:
// app.use('/customer/:id', resolvefinduserid);
// This means:
// It will only execute when the request path starts with /customer/ and has a dynamic parameter :id (like /customer/3).

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