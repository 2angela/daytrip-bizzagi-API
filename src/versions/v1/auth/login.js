import { firebaseAuth, db } from "../../../index.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = async (request, response, next) => {
  const { email, password } = request.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    // get token
    const token = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;
    // get user's data from database
    const docRef = doc(db, "Users", uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error("The requested data does not exist");

    const { name } = docSnap.data();

    return response.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        uid,
        email,
        name,
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

export default Login;
