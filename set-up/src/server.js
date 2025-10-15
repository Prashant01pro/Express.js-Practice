// So… is .mjs necessary?
// No, if your package.json already has "type": "module", you can use .js for ES Modules.
// .mjs is mainly used if:
// You don’t want to set "type": "module" globally in your package.json, or
// You want to mix ES Modules and CommonJS in the same project.

// 🛑 Bug in error response
// Your code:
// if (!finduser) {
//     return res.status(404);
// }
// This sets HTTP status to 404 but doesn’t send a response body, so client will hang.
// 👉 Fix: send a proper response:
// if (!finduser) {
//     return res.status(404).send({ msg: 'User not found' });
// }


import express from 'express';

const app = express();

const userinfo = [
    { id: 1, username: 'harsh', displayname: 'harsh@12' },
    { id: 2, username: 'harshita', displayname: 'harshita@12' },
    { id: 3, username: 'ansh', displayname: 'ansh@12' }
]

app.get('/', (req, res) => {
    // res.send('Server is running');
    console.log(req.query);
    res.send(req.query);
})

//📌 In Express.js
//Express automatically parses query strings and gives them to you in req.query.
// Request:
// GET http://localhost:3000?keyword=node&limit=10
// Output (req.query):
// { keyword: 'node', limit: '10' }


app.get('/api/user', (req, res) => {
    res.send(userinfo);
})

// request parameter
app.get('/api/user/:id', (req, res) => {
    console.log(req.params);
    const parsedid = parseInt(req.params.id);
    if (isNaN(parsedid)) {
        return res.status(400).send({ msg: 'bad request. Invalid ID' });
    }
    const finduser = userinfo.find((user) => user.id === parsedid );
    if (!finduser) {
        return res.status(404).send('user not Found');
    } else {
        return res.send(finduser);
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is at : http://localhost:${PORT}`);
})