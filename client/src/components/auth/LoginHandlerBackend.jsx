export async function RegisterNewAccount(email, password) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL5000}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    const data = await response.json();
    // console.log("Registration successful:", data);
    // Optionally, you can return data or perform other actions based on the response
    return data;
  } catch (error) {
    // console.error("Error registering account:", error.message);
    // Handle the error (e.g., display an error message to the user)
  }
}

export async function Login(email, password, setIsLoggedIn, setErrorMessage, rememberMe) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL5000}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    // console.log("Login successful:", data);

    // Set the isLoggedIn state to true
    setIsLoggedIn(true);

    // Store the token securely
    if (rememberMe) {
      localStorage.setItem("token", data.token);
    }

    // Optionally, you can return data or perform other actions based on the response
    return data;
  } catch (error) {
    // setErrorMessage("Wrong email or password");
    console.error("Error logging in:", error.message);
  }
}
