import schema from "../../../schema/signup.js";
import { firebaseAuth, db } from "../../../index.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
    const token = await userCredential.user.getIdToken();
    await setDoc(doc(db, "Users", uid), {
      uid,
      name,
      email
    });

    return response.status(201).json({
      success: true,
      message: "Sign up successful",
      data: {
        uid,
        name,
        email,
        token
      }
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export default SignUp;
