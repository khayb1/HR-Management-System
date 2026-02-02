import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const ManageUsers = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "employee",
    leave_balance: 20,
    department_id: "",
  });

  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Fetch current user's role and departments
  useEffect(() => {
    fetchCurrentUser();
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profile")
        .select("role")
        .eq("id", user.id)
        .single();
      if (data) {
        setCurrentUserRole(data.role);
      }
    }
  };

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("id, name")
      .order("name");

    if (!error && data) {
      setDepartments(data);
    }
  };

  const fetchUsers = async () => {
    setFetchingUsers(true);
    const { data, error } = await supabase
      .from("profile")
      .select(
        `
        id,
        full_name,
        email,
        role,
        department_id,
        departments (name)
      `,
      )
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setFetchingUsers(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in");
        setLoading(false);
        return;
      }

      // Check if current user is admin
      const { data: profile } = await supabase
        .from("profile")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        setError("Only admins can create users");
        setLoading(false);
        return;
      }

      // Prepare request body
      const requestBody = {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        role: form.role,
        leave_balance: parseInt(form.leave_balance),
        requesting_user_id: user.id,
      };

      // Only add department_id if role is not admin AND department is selected
      if (form.role !== "admin" && form.department_id) {
        requestBody.department_id = form.department_id;
      }

      console.log("Calling edge function...");

      // Call edge function
      const { data, error: functionError } = await supabase.functions.invoke(
        "create-user",
        {
          body: requestBody,
        },
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data?.error) {
        setError(data.error);
      } else {
        setSuccess(data?.message || "User created successfully");
        setForm({
          full_name: "",
          email: "",
          password: "",
          role: "employee",
          leave_balance: 20,
          department_id: "",
        });
        fetchUsers();
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "An error occurred while creating user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This will also delete their auth account.",
      )
    ) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in");
        return;
      }

      // Check if current user is admin
      const { data: profile } = await supabase
        .from("profile")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        setError("Only admins can delete users");
        return;
      }

      // Delete from auth.users (requires admin privileges)
      const { error: deleteError } =
        await supabase.auth.admin.deleteUser(userId);

      if (deleteError) {
        // Fallback: just delete from profile if auth deletion fails
        const { error: profileError } = await supabase
          .from("profile")
          .delete()
          .eq("id", userId);

        if (profileError) {
          setError(profileError.message);
        } else {
          setSuccess("User deleted from profile (auth deletion failed)");
          fetchUsers();
        }
      } else {
        setSuccess("User deleted successfully");
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || "An error occurred while deleting user");
    }
  };

  // If current user is not admin, show restricted view
  if (currentUserRole && currentUserRole !== "admin") {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-red-600">
            Access denied. Only administrators can manage users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create User Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Create New User</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Temporary Password *
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                User will be able to change this after first login
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Initial Leave Balance (Days)
              </label>
              <input
                name="leave_balance"
                type="number"
                value={form.leave_balance}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="employee">Employee</option>
                <option value="hod">Head of Department (HOD)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {form.role !== "admin" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department *
                </label>
                <select
                  name="department_id"
                  value={form.department_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={form.role !== "admin"}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {loading ? "Creating User..." : "Create User"}
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Users ({users.length})</h2>
            <button
              onClick={fetchUsers}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Refresh
            </button>
          </div>

          {fetchingUsers ? (
            <div className="text-center py-8 text-gray-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No users found</div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {user.full_name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "hod"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {user.departments && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {user.departments.name}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {user.leave_balance} days leave
                        </span>
                      </div>
                    </div>

                    {currentUserRole === "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="ml-4 px-3 py-1 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded transition"
                        title="Delete User"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
