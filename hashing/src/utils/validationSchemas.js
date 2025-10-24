export const createnamevalidateSchema = {
    name: {
        notEmpty: {
            errorMessage: "Name can't be empty"
        },
        isString: {
            errorMessage: "Name must be string"
        },
        isLength: {
            options: { min: 5, max: 30 }
        },
        errorMessage: "Name must be in between 5 to 30 characters",
    },
    age: {
        notEmpty:true,
    },
    password:{
        notEmpty:true,
    }
}