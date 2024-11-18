"use client"; // Ensure this component is client-side

import { useState } from "react";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth"; // Import AWS Amplify's functions
import { useRouter } from "next/navigation"; // Correct import for router in Next.js 13+
import { Amplify } from "aws-amplify"; // Combined imports for clarity
import awsmobile from "../../../aws-exports"; // Configuration file for AWS Amplify

// Configure Amplify with the exported settings
Amplify.configure(awsmobile);

const CreateAccount = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false); // State for confirming sign-up
  const [isSignedIn, setIsSignedIn] = useState(false); // State for handling sign-in
  const router = useRouter();

  // Handle account creation
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            phone_number: phone,
          },
        },
      });

      console.log("Sign-up successful:", { isSignUpComplete, userId, nextStep });
      setIsConfirming(true); // Set confirming mode to true for confirmation code input
    } catch (err) {
      setError("Error creating account: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign-up confirmation
  const handleSignUpConfirmation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode,
      });
      console.log("Confirmation successful:", { isSignUpComplete, nextStep });

      // If confirmation is successful, proceed to sign in
      handleSignIn({ username, password });
    } catch (error) {
      setError("Error confirming sign up: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign-in process
  const handleSignIn = async ({ username, password }) => {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      setIsSignedIn(true);
      console.log("Sign-in successful:", { isSignedIn, nextStep });
      
      // Redirect to home or dashboard after successful sign-in
      router.push("/dashboard");
    } catch (error) {
      setError("Error signing in: " + error.message);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto", padding: "20px", backgroundColor: "#f7f7f7", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
        {isConfirming ? "Confirm Sign-Up" : "Create an Account"}
      </h1>

      <form onSubmit={isConfirming ? handleSignUpConfirmation : handleCreateAccount} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {isConfirming ? (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "600", marginBottom: "8px" }}>Confirmation Code</label>
              <input
                type="text"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <button type="submit" style={{ padding: "12px", backgroundColor: isLoading ? "#888" : "#0056b3", color: "#fff", border: "none", borderRadius: "4px", cursor: isLoading ? "not-allowed" : "pointer", fontSize: "16px" }} disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm Sign-Up"}
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "600", marginBottom: "8px" }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "600", marginBottom: "8px" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "600", marginBottom: "8px" }}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", width: "100%", boxSizing: "border-box" }}
                pattern="^\+?[1-9]\d{1,14}$" // E.164 format validation for phone numbers
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ fontWeight: "600", marginBottom: "8px" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px", fontSize: "16px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <button type="submit" style={{ padding: "12px", backgroundColor: isLoading ? "#888" : "#0056b3", color: "#fff", border: "none", borderRadius: "4px", cursor: isLoading ? "not-allowed" : "pointer", fontSize: "16px" }} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </button>
          </>
        )}
      </form>

      {/* Sign-In Option */}
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#0056b3", textDecoration: "underline" }}>
          Sign In
        </a>
      </p>

      {error && <p style={{ color: "#e74c3c", fontSize: "14px", textAlign: "center", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default CreateAccount;
