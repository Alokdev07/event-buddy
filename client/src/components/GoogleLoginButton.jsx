// src/components/GoogleLoginButton.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

export default function GoogleLoginButton() {
  const divRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.google || !divRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          console.log('Google login initiated...'); // Debug log
          
          const res = await axios.post(
            "http://localhost:8000/api/v1/users/auth_login",
            { credential: response.credential },
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Backend response:", res.data); // Debug log
          
          // Extract user data from your backend response
          // Adjust these based on your actual API response structure
          const userData = res.data.data || res.data.user || res.data;
      

          // Update auth context
          login(userData);
          
          console.log('Login successful, navigating to home...'); // Debug log
          
          // Navigate to home page
          navigate('/');
          
        } catch (err) {
          console.error("Login failed:", err.response?.data || err.message);
        }
      },
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(divRef.current, {
      theme: "outline",
      size: "large", 
      type: "standard",
      text: "signin_with",
      shape: "rectangular",
      width: "100%",
    });
  }, [login, navigate]);

  return (
    <div className="w-full">
      <div ref={divRef} className="w-full" />
    </div>
  );
}
