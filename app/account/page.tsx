import { SignOutButton } from "@/components/ui/SignOutButton"

const Account = () => {
    return (
        <div className="flex min-h-screen">
           {/* left bar */}
           <div className="w-1/4 p-4 border-r">
             <div className="flex flex-col h-full">
               <div className="flex-1">
                 {/* Navigation items can go here */}
               </div>
               <div className="mt-auto">
                 <SignOutButton />
               </div>
             </div>
           </div>
           
           {/* main content */}
           <div className="w-3/4 p-8">
             <h1 className="text-2xl font-bold mb-6">Account Dashboard</h1>
             {/* Main content goes here */}
           </div>
        </div>
    );
}   

export default Account;
