import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"
import SideBar from "../components/SideBar"
function Home() {

  return (
    <div>
      <header className="sticky top-0 left-0 w-full">
        <NavBar />
        <SideBar />
      </header>
      <main className="flex ">
        <section className="p-4 w-full">
         <Outlet/>
        </section>
      </main>
    </div>
  )
}

export default Home
