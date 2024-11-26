import schema from "../../../schema/signup.js";
import { firebaseAuth } from "../../../index.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
import { admin } from "../../../firebase.js";

const SignUp = async (request, response, next) => {
  try {
    const { name, email, password } = request.body;
    const { error } = schema.validate({ name, email, password });
    if (error) throw new Error(error);

    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    
    const uid = userCredential.user.uid;
    await admin.firestore().collection("Users").doc(uid).set({
      name,
      email
    });

    const token = await userCredential.user.getIdToken();

    return response.status(201).json({
      success: true,
      message: "Created",
      data: {
        uid,
        name,
        email,
        token: token
      }
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export default SignUp;
