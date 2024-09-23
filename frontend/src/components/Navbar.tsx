import logo from "../assets/img/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Navbar = () => {
  return (
    <nav className=" flex justify-between items-center p-3  shadow-xl">
      <a href="https://github.com/stampcodes" target="_blank">
        <FontAwesomeIcon
          className="h-[70px] text-[#b7441a] cursor-pointer hover:text-[#be5630] transition duration-300 hover:scale-110 ml-10 "
          icon={faGithub}
        />
      </a>
      <img src={logo} className=" w-[250px] ml-20 " alt="logo" />
      <div className="mr-10">
        <w3m-button />
      </div>
    </nav>
  );
};

export default Navbar;
