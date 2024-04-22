import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      { isAuthenticated ? (
          <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>
          <img
             src= "https://images.unsplash.com/photo-1564758866214-00e54c39b3f2?q=80&w=2865&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            // src = "https://media.istockphoto.com/id/518593585/photo/cup-of-coffee.jpg?s=1024x1024&w=is&k=20&c=PdK59AuOeyKnUlNMqv3LZLsmU1GKOPTUOwNV_HB7zbw="
            //src = "/assets/images/Tea.jpeg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </> 
      )}
    </>
  );
}

export default AuthLayout