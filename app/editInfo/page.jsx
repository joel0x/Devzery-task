// // pages/editInfo.js
// "use client"
// import React from "react";
// import { connectMongoDB } from "@/lib/mongodb"; // Import your MongoDB connection function

// const EditInfo = () => {
//   // Make sure to call connectMongoDB inside a function or a lifecycle method
//   React.useEffect(() => {
//     const fetchData = async () => {
//       await connectMongoDB();
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Edit Info Page</h1>
//       {/* Add your edit info content here */}
//     </div>
//   );
// };

// export default EditInfo;


"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function EditInfo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }
  
    try {
      // Check if the user already exists
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
  
      const { user } = await resUserExists.json();
  
      if (!user) {
        setError("User does not exist. Cannot update details.");
        return;
      }
  
      // Update user details
      const res = await fetch("api/updateUserDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/register");
      } else {
        const contentType = res.headers.get("content-type");
        const responseData = await res.text();
  
        if (contentType && contentType.includes("application/json")) {
          try {
            const { error } = JSON.parse(responseData);
            setError(error || "User details update failed.");
            console.log("User details update failed:", error);
          } catch (error) {
            setError("User details update failed. Error parsing JSON response.");
            console.log("User details update failed. Error parsing JSON response:", error);
          }
        } else {
          setError("User details update failed. Unexpected response format.");
          console.log("User details update failed. Unexpected response format:", responseData);
        }
      }
    } catch (error) {
      setError("Error during user details update.");
      console.log("Error during user details update:", error);
    }
    
  };  
  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Change Details</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Update Details
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
