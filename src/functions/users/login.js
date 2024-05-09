import { findUserByEmail, createJWT, validatePassword } from "../helpers/authHelpers";

const login = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    // Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "User not found" })
      };
    }

    const passwordIsValid = await validatePassword(password, user.password);
    if (!passwordIsValid) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Incorrect password!" })
      };
    }

    const token = createJWT({ id: user.id, email: user.email })

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        email: user.email,
        token: token,
      }),
    };

  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Login error." })
    };
  }
};

export default login;