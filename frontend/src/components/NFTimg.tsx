import premint from "../assets/img/premint.png";

const NFTimg = () => {
  return (
    <>
      <div className="flex justify-center mt-10">
        <img
          src={premint}
          className="w-[512px] h-[512px] rounded-[15px] "
          alt="img premint"
        />
      </div>
    </>
  );
};

export default NFTimg;
