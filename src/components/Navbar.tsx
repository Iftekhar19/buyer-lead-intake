'use client'
import { useRouter } from "next/navigation";

const Navbar = () => {
    const navigate=useRouter()
    const handleLogOut=async()=>
    {
       try {
         await  fetch(`/api/logout`,{
             method:"POST",
             credentials:"include"
         })
         console.log("Logged out successfully")
         navigate.replace('/login')
       } catch (error) {
        console.log(error)
        alert("Unable to logout")
       }

    }
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="w-full mx-auto px-4 sm:px-4 lg:px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo / Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
            Buyer Lead Intake
          </h1>

          {/* Logout Button */}
          <button
            className="cursor-pointer bg-white text-blue-600 font-medium px-4 py-1.5 rounded-lg shadow 
                       hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
                       onClick={handleLogOut}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
