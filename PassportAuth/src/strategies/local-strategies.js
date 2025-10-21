import passport from "passport";
import { Strategy } from "passport-local";
import { customer } from "../utils/constants.js";

passport.serializeUser((user, done) => {
    console.log("under serialize user");
    console.log(user);

    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    console.log("under deserialize user")
    console.log(id);

    try {
        const finduser = customer.find((user) => user.id === id);
        if (!finduser) throw new Error("user not found");
        done(null, finduser);
    } catch (err) {
        done(err, null)
    }
})

passport.use(
    // new Strategy({usernameField:"email"},(username, password, done) => {
    new Strategy({ usernameField: "name" }, (name, password, done) => {
        console.log(name);
        console.log(password);
        try {

            const finduser = customer.find((user) => user.name === name);
            if (!finduser) throw new Error("user not Found");
            if (finduser.password !== password) throw new Error("Creditials Invalid");
            return done(null, finduser)
        } catch (err) {
            done(err, null);
        }
    })
)

export default passport;