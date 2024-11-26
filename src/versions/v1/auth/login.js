import { firebaseAuth } from "../../../index.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = async (request, response) => {
  const { email, password } = request.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();

    response.status(200).json({
      message: "Login successful",
      token: token
    });
  } catch (error) {
    response.status(401).json({
      message: "Login failed",
      error: error.message
    });
  }
};

export default Login;