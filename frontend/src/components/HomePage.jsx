
export default function HomePage() {
    return (
      <main className="relative bg-transparent text-gray-800 overflow-hidden min-h-screen">
        {/* Background Blur Layer */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[90%] h-[400px] bg-gradient-to-r from-purple-300 via-blue-200 to-purple-200 opacity-80 blur-3xl rounded-full"></div>
          <div className="absolute bottom-[-10%] right-1/3 w-[70%] h-[300px] bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 opacity-70 blur-3xl rounded-full"></div>
        </div>
  
        {/* Hero Section */}
        <section className="py-24 px-4 flex justify-center items-center">
          <div className="bg-white/70 rounded-xl p-10 shadow-lg backdrop-blur-sm max-w-3xl text-center">
            <h1 className="text-4xl font-bold mb-4">Task Management System</h1>
            <p className="text-lg text-gray-700">
              A powerful tool to manage your team’s tasks efficiently. Create, assign, track, and collaborate — all in one place.
            </p>
          </div>
        </section>
  
        {/* Key Features Section */}
        <section className="py-16">
       <div className="max-w-6xl mx-auto px-6">
         <h3 className="text-2xl font-semibold text-center mb-10">Key Features</h3>
         <div className="grid md:grid-cols-3 gap-8">
           {[
             { title: "Secure Authentication", desc: "User login & registration with hashed passwords." },
             { title: "Task Assignment", desc: "Easily assign tasks to team members." },
             { title: "Real-time Updates", desc: "Stay up-to-date with task status and deadlines." }
           ].map((feature, i) => (
             <div key={i} className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow hover:shadow-lg transition">
               <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
             <p className="text-gray-600">{feature.desc}</p>
             </div>
           ))}
         </div>
       </div>
     </section>
  
        {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
       <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
         <p className="text-sm">&copy; {new Date().getFullYear()} TaskManager Inc. All rights reserved.</p>
         <div className="flex space-x-4 mt-4 md:mt-0">
           <a href="#" className="hover:text-white text-sm">Privacy Policy</a>
           <a href="#" className="hover:text-white text-sm">Terms of Service</a>
           <a href="#" className="hover:text-white text-sm">Contact</a>
         </div>
       </div>
     </footer>
      </main>
    );
  }
  