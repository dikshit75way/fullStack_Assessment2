import { Outlet, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import { useLogoutMutation } from "../services/auth";
import toast from "react-hot-toast";
import { UserActions } from "../components/Layout/UserActions";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [logoutServer] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutServer({}).unwrap();
    } catch (err) {
      console.error("Server logout failed", err);
    } finally {
      dispatch(logout());
      toast.success("Logged out successfully");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center text-2xl font-extrabold text-gradient-brand">
              CarRental
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/vehicles" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition hover:bg-gray-50">
                Browse Fleet
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <UserActions 
              isAuthenticated={isAuthenticated} 
              user={user as any} 
              onLogout={handleLogout} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          &copy; {new Date().getFullYear()} Car Rental System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
