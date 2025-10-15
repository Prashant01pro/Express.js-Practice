import express from 'express';

const app = express();

// middleware 
app.use(express.json());

const userinfo = [
    { id: 1, username: 'harsh', displayname: 'harsh@12' },
    { id: 2, username: 'harshita', displayname: 'harshita@12' },
    { id: 3, username: 'ansh', displayname: 'ansh@12' },
    { id: 4, username: 'marsh', displayname: 'marsh@12' },
    { id: 5, username: 'marshita', displayname: 'marshita@12' },
    { id: 6, username: 'yanshu', displayname: 'yanshu@12' }
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
    console.log(req.query);
    // res.send(req.query);
    // res.send(userinfo);

    // To  check type : http://localhost:3000/api/user?filter=username&value=ha
    const { query: { filter, value } } = req;
    if (!filter && !value) {
        return res.send(userinfo);
    }
    if (filter && value) {
        let result = userinfo.filter((user) => user[filter].includes(value))
        return res.send(result);
    }
    return res.send(userinfo)
})

// request parameter
app.get('/api/user/:id', (req, res) => {
    console.log(req.params);
    const parsedid = parseInt(req.params.id);
    if (isNaN(parsedid)) {
        return res.status(400).send({ msg: 'bad request. Invalid ID' });
    }
    const finduser = userinfo.find((user) => user.id === parsedid);
    if (!finduser) {
        return res.status(404).send('user not Found');
    } else {
        return res.send(finduser);
    }
})

// res.send() only accepts a single argument.
// Passing two arguments like that will not work — only the first one (newuser) is sent.

app.post('/api/user', (req, res) => {
    //console.log(req.body);
   // return res.send(200);
    const {body}=req;
    const newuser={id:userinfo.length+1, ...body};
    userinfo.push(newuser);
    return res.status(201).send(newuser)
    //return res.status(201).send({newUser:newuser, alluser:userinfo})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is at : http://localhost:${PORT}`);
})