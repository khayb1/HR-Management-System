import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router";
import { Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  // handling login
  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Basic validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    // user friendly errors
    // User-friendly error messages
    // if (error.message.includes("Invalid login credentials")) {
    //   setMessage("Invalid email or password. Please try again.");
    // } else if (error.message.includes("Email not confirmed")) {
    //   setMessage("Please verify your email address before logging in.");
    // } else if (error.message.includes("rate limit")) {
    //   setMessage("Too many attempts. Please try again later.");
    // } else {
    //   setMessage(error.message || "An error occurred during login");
    // }

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Login successful!");
      console.log(data.user);
    }

    // 2. Fetch user role
    const { data: profile, error: roleError } = await supabase
      .from("profile")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (roleError) {
      setMessage("Role not found");
      return;
    }

    // 3. Redirect based on role
    switch (profile.role) {
      case "admin":
        navigate("/adminDashboard");
        break;
      case "hod":
        navigate("/hodDashboard");
        break;
      case "employee":
        navigate("/employeeDashboard");
        break;
      default:
        navigate("/");
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
            Sign In
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
