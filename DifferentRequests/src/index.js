import express from "express"

const app = express();
app.use(express.json());

// Middleware and the sequence of passing the middleware is very important because middleware is working according to the sequence it is defined

const mymiddleware = (req, res, next) => {
    console.log(`${req.method},${req.url}`);
    next();
}

// To set middleware globally : means used in every http methods(PUT,POST,DELETE,GET)
app.use(mymiddleware, (req, res, next) => {
    console.log("Second middleware"); next();
}, (req, res, next) => {
    console.log("third middleware");
    next();
}
);

const customer = [
    { id: 1, name: 'Roushan', age: 23, value: 300 },
    { id: 2, name: 'shyam', age: 20, value: 500 },
    { id: 3, name: 'shubham', age: 12, value: 100 },
    { id: 4, name: 'raina', age: 40, value: 200 },
    { id: 5, name: 'suman', age: 30, value: 600 },
]


app.get('/', mymiddleware, (req, res) => {       // to set middleware in this base url do like this
    res.send('Request is Running');
})

// we can define in defining http methods handles or can be defined somewhere and use in http methods
app.get('/user', (req, res, next) => { console.log('Base url 1'); next(); }, (req, res, next) => { console.log('Base url 2'); next(); }, (req, res) => {       // to set middleware in this base url do like this
    res.send('Request is Running with multiple middleware');
})

app.put('/customer/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { body } = req;

    const finduserid = customer.findIndex((user) => user.id === id);
    if (isNaN(id)) {
        return res.status(400).send('Bad Request');
    }

    // 3️⃣ Check if user exists
    if (finduserid === -1) {
        return res.status(404).send('User not found');
    }

    const updatecustomer = { id, ...body };
    customer[finduserid] = updatecustomer
    res.status(200).send({ updatecustomer, customer });

})


app.patch('/customer/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { body } = req;

    const finduserid = customer.findIndex((user) => user.id === id);
    if (isNaN(id)) {
        return res.status(400).send('Bad Request');
    }
    if (finduserid === -1) {
        return res.status(404).send('User not found');
    }
    //// Only update fields provided in the request body
    Object.assign(customer[finduserid], body);
    res.status(200).send(customer);
})

app.delete('/customer/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const { body } = req;

    const finduserid = customer.findIndex((user) => user.id === id);
    if (isNaN(id)) {
        return res.status(400).send('Bad Request');
    }
    if (finduserid === -1) {
        return res.status(404).send('User not found');
    }

    const deleteuser = customer.splice(finduserid, 1);
    res.send({ deleteuser, customer });

    // Removes one element at the finduserid index.
    // splice returns an array of deleted items, so deleteuser[0] is the actual removed object.
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
})