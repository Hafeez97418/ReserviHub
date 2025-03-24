import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import AuthGate from "../components/AuthGate";



function Home() {
  return (
    <div>
      <header className="sticky top-0 left-0 w-full z-40">
        <NavBar />
        <SideBar />
      </header>
      <main className="flex">
        <section className="p-4 w-full">
          <AuthGate/>
        </section>
      </main>
    </div>
  );
}

export default Home;
