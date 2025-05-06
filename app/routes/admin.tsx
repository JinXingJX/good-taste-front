// app/routes/admin.tsx (New File)
import { useState, useEffect } from 'react';
import { Outlet, useLoaderData, redirect, useLocation } from 'react-router';
import { json } from '@react-router/node'; // Use json from node
import Sidebar from '~/components/admin/Sidebar';
import { useAuth } from '~/context/AuthContext'; // Use the custom hook
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode


// Loader function to check authentication before rendering admin routes
export async function loader({ request }) {
  // This loader runs on the server AND potentially on client-side navigations.
  // We need a way to check auth that works in both environments.
  // Reading localStorage directly here WON'T work server-side.

  // --- Strategy 1: Check on Client Side via Context (Simpler for SSR setup) ---
  // We'll rely on the AuthProvider's useEffect check and the component logic below.
  // This loader can simply return null or basic layout data.
  // return json({ ok: true });

  // --- Strategy 2: Server-Side Cookie Check (More Robust for SSR Protection) ---
  // If your JWT is stored in an HttpOnly cookie accessible by the server:
  /*
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parseCookies(cookieHeader || ''); // Implement or use a library like 'cookie'
  const token = cookies.authToken; // Assuming your cookie is named 'authToken'

  if (!token) {
    console.log("Admin Loader: No token found, redirecting to login.");
    return redirect(`/admin/login?redirectTo=${new URL(request.url).pathname}`);
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp <= currentTime) {
      console.log("Admin Loader: Token expired, redirecting to login.");
      return redirect(`/admin/login?redirectTo=${new URL(request.url).pathname}`);
    }
    // Optionally, verify the user role server-side if needed
    if (decoded.role !== 'admin') {
       console.log("Admin Loader: User not admin, redirecting.");
       // Redirect non-admins somewhere else, maybe home or an error page
       return redirect('/');
    }
    // Pass decoded user info to the component if needed
    return json({ serverUser: { id: decoded.id, username: decoded.username, role: decoded.role } });
  } catch (error) {
    console.log("Admin Loader: Invalid token, redirecting to login.");
    return redirect(`/admin/login?redirectTo=${new URL(request.url).pathname}`);
  }
  */

  // --- Using Client-Side Check Primarily (Strategy 1) ---
  // This loader doesn't gatekeep server-side, relying on the component + AuthContext.
  // It might flash the admin layout briefly before the client-side check redirects.
   return json({ serverChecked: false }); // Indicate loader ran, but didn't verify auth server-side

}


export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isAuthenticated, loading, logout } = useAuth(); // Use context hook
  const navigate = useNavigate();
  const location = useLocation();

  // Client-side check after component mounts or context updates
  useEffect(() => {
    // If loading is finished and user is NOT authenticated, redirect to login
    if (!loading && !isAuthenticated) {
        console.log("AdminLayout Effect: Not authenticated, redirecting to login.");
        // Preserve the intended destination
        navigate(`/admin/login?redirectTo=${location.pathname}`, { replace: true, state: { from: location } });
    }
    // Optional: Redirect if authenticated but not an admin (if needed)
    // else if (!loading && isAuthenticated && user?.role !== 'admin') {
    //    console.log("AdminLayout Effect: User is not admin, redirecting.");
    //    navigate('/', { replace: true }); // Redirect to homepage
    // }

  }, [isAuthenticated, loading, navigate, location, user]);


  // Show loading state or nothing while auth check is happening
  if (loading) {
    return <div>Loading Admin Area...</div>; // Or a proper loading spinner
  }

  // If check is done and still not authenticated, render null or redirect
  // (The useEffect above should handle the redirect, but this is a fallback)
  if (!isAuthenticated) {
     return null; // Avoid rendering layout if redirect hasn't happened yet
  }

  // User is authenticated, render the admin layout
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        user={user} // Pass the user object from context
        onLogout={logout} // Pass the logout function from context
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Optional: Add an Admin Header here */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Render the specific admin page (Dashboard, Pages, Products, etc.) */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}