import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .required(),
  password: Joi.string().min(6).required()
});

export default schema;
