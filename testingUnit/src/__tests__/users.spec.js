import { getuserbyidhandler } from "../handlers/users.js"
import { customer } from "../utils/constants.js";

const customerreq = {
    finduserid: 1
};

const customerres = {
    sendStatus: jest.fn(),
    send: jest.fn(),
};

describe('get users', () => {
    it('should get user by id', () => {
        getuserbyidhandler(customerreq, customerres);
        expect(customerres.send).toHaveBeenCalled();
        expect(customerres.send).toHaveBeenCalledWith(customer[1]);
    })
})