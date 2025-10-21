import express from "express";
import cookie from "cookie-parser"
import routes from "./routers/indexRouter.js";
import sessions from "express-session";
import { customer } from "./utils/constants.js";
import passport from "passport";
import "./strategies/local-strategies.js";


const app = express();

app.use(express.json());
// app.use(cookie('hellosyn'));    // Sign Cookies must before routes
app.use(cookie());    // Cookies must before routes

app.use(sessions({
    secret: 'parsha',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
}))  // use before the routes end points

// This middleware:
// Creates a unique session ID (like connect.sid=abc123).
// Stores session data (like req.session.user) on the server (default in memory).
// Sends a signed cookie to the client containing only the session ID — not the user data.

app.use(passport.initialize());
app.use(passport.session());


app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is at : http://localhost:${PORT}`);
})


app.get('/', (req, res) => {

    //In Express.js, when you use express-session, the session ID is stored in a cookie on the client.
    console.log(req.session);
    console.log(req.sessionID)
    console.log(req.session.id);

    req.session.visited = true;

    //4️⃣ Important Notes
    // Always call app.use(cookie()) before using routes that depend on cookies.
    // If you delete or rename the cookie in browser → you’ll get:

    // res.cookie("hello", "World", { maxAge: 60000 * 60, signed: true });
    res.cookie("hello", "World", { maxAge: 60000 * 60 });
    res.send('Hello jii')

})

app.post('/api/auth', (req, res) => {
    const { name, password } = req.body;
    const finduser = customer.find((user) => user.name === name);
    if (!finduser || finduser.password !== password) {
        return res.status(401).send('Bad Creditials Requested');
    }

    req.session.user = finduser;
    return res.status(200).send(finduser);
})

app.get('/api/auth/status', (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
        console.log(req.sessionID);
    })

    return req.session.user ? res.status(200).send(req.session.user) : res.status(401).send('Bad Creditials Requested');
})

// Both are stored in Express’s in-memory session store:
// QVrb5EC7... → Thunder Client (suman)
// ftd_0sFAO... → Postman (shyam)

// ⚙️ Why This Works Perfectly
// Each HTTP client maintains its own cookie store:
// Thunder Client keeps its own cookies.
// Postman keeps its own cookies.
// Browser keeps its own cookies.
// Each one automatically sends its own connect.sid back with every request — so the server can identify the user uniquely.


//To see both stored sessions:
app.get('/debug/session', (req, res) => {
    req.sessionStore.all((err, sessions) => {
        res.send(sessions);
    });
})

app.post('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401)
    const { item, price } = req.body;
    const { cart } = req.session;

    if (cart) {
        cart.push({ item, price });
    } else {
        req.session.cart = [{ item, price }];
    }
    return res.status(201).send({ item, price });
})

app.get('/api/cart', (req, res) => {
    if (!req.session.user) return res.sendStatus(401)
    return res.send(req.session.cart ?? []);
})

//🧠 Step 2: What the ?? operator does
// The nullish coalescing operator (??) is a JavaScript feature that says:
// “If the value on the left is null or undefined, then use the value on the right.”

app.post("/api/authenticate",
    // passport.Authenticator("github"),
    // passport.Authenticator("discord"),
    passport.authenticate("local"),
    (req, res) => {
        res.send(200);
    })

app.get("/api/authenticate/status", (req, res) => {
    console.log("inside /api/authenticate/status");
    console.log(req.user);
    console.log(req.session)
    return req.user ? res.send(req.user) : res.sendStatus(401);
})

app.post("/api/authenticate/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.send(200);
    })
})