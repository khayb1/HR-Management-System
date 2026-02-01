import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { LoaderIcon, Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  const { user, role } = useAuth();

  useEffect(() => {
    if (user && role) {
      if (role === "admin") navigate("/adminDashboard");
      if (role === "hod") navigate("/hodDashboard");
      if (role === "employee") navigate("/employeeDashboard");
    }
  }, [user, role]);

  // handling login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // 1️⃣ Validate input FIRST
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    // Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data?.user) {
      setMessage("Login failed");
      setLoading(false);
      return;
    }

    // Fetch role from profile table
    const { data: profile, error: roleError } = await supabase
      .from("profile")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (roleError || !profile?.role) {
      setMessage("Role not assigned. Contact admin.");
      setLoading(false);
      return;
    }

    // Redirect immediately based on role
    switch (profile.role) {
      case "admin":
        navigate("/adminDashboard", { replace: true });
        break;

      case "hod":
        navigate("/hodDashboard", { replace: true });
        break;

      case "employee":
        navigate("/employeeDashboard", { replace: true });
        break;

      default:
        navigate("/", { replace: true });
    }
  };

  return (
    <>
      <main className="bg-amber-100 w-full h-screen py-auto text-center flex flex-col justify-center items-center">
        <form
          onSubmit={handleLogin}
          className="w-96 relative h-fit px-10 py-12 mx-auto rounded-2xl shadow-2xl bg-gray-100/90 bg flex flex-col"
        >
          <p className="text-3xl pb-5 text-gray-950 font-bold ">
            Welcome Back!
          </p>
          <p className="text-md  text-gray-500">Please enter your details</p>

          {/* email  */}
          <div className="py-5">
            <span className="flex gap-2 items-center">
              <Mail className="m-2" />
              Email
            </span>

            <input
              type="text"
              placeholder="email address"
              value={email}
              className=" p-3 rounded-xl font-medium w-full bg-white"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* password  */}
          <div className="py-5 ">
            <span className="flex items-center">
              <Lock className="m-2" />
              Password
            </span>

            <input
              type="password"
              value={password}
              placeholder="........"
              className=" p-3 rounded-xl font-medium  w-full bg-white"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* submit button  */}
          <button
            type="submit"
            className="bg-gray-300 hover:bg-gray-500 text-lg font-medium p-2 pt-3 rounded-lg transition-all"
          >
            {loading ? "signing in" : "sign in"}
          </button>
          {message && (
            <p className="text-sm fond-bold text-black text-shadow-2xs absolute bottom-0 w-fit mx-auto">
              {message}
            </p>
          )}
        </form>
      </main>
    </>
  );
};

export default Login;
