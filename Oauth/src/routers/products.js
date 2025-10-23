import { signedCookies } from "cookie-parser";
import { Router } from "express";

const router = Router();


router.get('/user/products', (req, res) => {
    console.log(req.headers.cookie)
    console.log(req.cookies)
    // console.log(cookie.signedCookies())
    if (req.cookies.hello && req.cookies.hello === "World")
        return res.send([{ id: 123, name: "Chicken Momo", price: 111 }]);

    return res.send({ message: 'Sorry you need the correct cookie' });
})


export default router;