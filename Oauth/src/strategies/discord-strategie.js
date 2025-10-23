import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.js";

passport.serializeUser((user, done) => {
    console.log("under serialize user");
    console.log(user);

    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    console.log("under deserialize user")
    console.log(id);

    try {
        // const finduser = customer.find((user) => user.id === id);
        const finduser = await DiscordUser.findById(id);
        return finduser?done(null,finduser):done(null,null)
        // if (!finduser) throw new Error("user not found");
        // done(null, finduser);
    } catch (err) {
        done(err, null)
    }
})




export default passport.use(
    new Strategy({
        clientID: '1428575471209021582',
        clientSecret: 'TzFqb1yzEykWQ3I3odMwfV1OpuRzBAon',
        callbackURL: 'http://localhost:3000/api/authenticate/discord/redirect',
        scope: ["identify", "guilds", "email"]
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log(profile);
        let finduser;
        try {
            finduser = await DiscordUser.findOne({ discordId: profile.id })
        } catch (err) {
            return done(err, null)
        }

        try {
            if (!finduser) {
                const newUser = new DiscordUser({
                    name: profile.username,
                    discordId: profile.id
                })
                const savenewUser = await newUser.save();
                return done(null, savenewUser)
            }
            return done(null,finduser)
        } catch (err) {
            console.log(err);
            return done(err,null);

        }
    })
)