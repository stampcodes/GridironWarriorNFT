import MintButton from "./components/MintButton";
import Navbar from "./components/Navbar";
import NFTimg from "./components/NFTimg";

function App() {
  return (
    <>
      <div className="h-[100vh] w-[100%]">
        <Navbar />
        <NFTimg />
        <MintButton />
      </div>
    </>
  );
}

export default App;
