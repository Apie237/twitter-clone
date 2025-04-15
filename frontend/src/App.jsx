import { Navigate, Route, Routes } from "react-router-dom";


import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import HomePage from "./pages/auth/Home/HomePage";

function App() {
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
		  console.log("Starting queryFn execution for authUser");
		  try {
			console.log("Attempting to fetch from /api/auth/me");
			const res = await fetch("/api/auth/me");
			console.log("Fetch response received:", res.status, res.statusText);
			
			const data = await res.json();
			console.log("Response data:", data);
			
			if (data.error) {
			  console.warn("Error found in response data:", data.error);
			  return null;
			}
			
			if (!res.ok) {
				console.error("Response not OK:", res.status, data.error || "Something went wrong");
				return null;
			}
			
			console.log("Auth user data successfully retrieved:", data);
			return data;
		  } catch (error) {
			console.error("Exception in queryFn:", error.message, error.stack);
			throw new Error(error.message || "Unknown error in queryFn");
		  }
		},
		retry: false,
	  });

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
			</Routes>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App;