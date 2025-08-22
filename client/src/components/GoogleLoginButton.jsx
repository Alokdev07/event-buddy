// src/GoogleLoginButton.jsx
import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {setUser} from '../store/Authslice'

export default function GoogleLoginButton() {
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    if (!window.google || !divRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
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

          console.log("Logged in user:", res.data.data);
          if (res.data.data) {
            dispatch(setUser(res.data.data)); 
            navigate("/");
          }
        } catch (err) {
          console.error("Login failed:", err.response?.data || err.message);
        }
      },
      ux_mode: "popup",
    });

    window.google.accounts.id.renderButton(divRef.current, {
      theme: "none",
      size: "medium",
      type: "standard",
      text: "sign_in",
      shape: "rectangular",
    });
  }, []);

  return <div ref={divRef} />;
}