import DefaultBanner from '../../../assets/Default-Banner-Template.png';
import DefaultBanner2 from "../../../assets/Default-Banner-Template-2.png";
import DefaultBanner3 from "../../../assets/Default-Banner-Template-3.png";
import DefaultBanner4 from "../../../assets/Default-Banner-Template-4.png";


const BannerEditor = ({ text, fontSize = "text-4xl", randomizer=4 }) => {
  const randomNumber = Math.floor(Math.random() * randomizer) + 1;

  const selectedBanner = {
    1: <Banner text={text} fontSize={fontSize} />,
    2: <Banner2 text={text} fontSize={fontSize} />,
    3: <Banner3 text={text} fontSize={fontSize} />,
    4: <Banner4 text={text} fontSize={fontSize} />,
  };

  return selectedBanner[randomNumber];
};

const Banner = ({ text, fontSize }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={DefaultBanner}
        alt=""
        className="w-full h-full object-cover z-8"
        loading="lazy"
      />
      <h1
        className={`absolute z-[11] top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${fontSize} uppercase whitespace-nowrap text-black font-['Alice']`}
      >
        {text}
      </h1>
    </div>
  );
};

const Banner2 = ({ text, fontSize }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={DefaultBanner2}
        alt=""
        className="w-full h-full object-cover z-8"
        loading="lazy"
      />
      <h1
        className={`absolute z-[11] top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${fontSize} uppercase whitespace-nowrap text-black tracking-wider font-light font-['Founders_Grotesk_X_Condensed']`}
      >
        {text}
      </h1>
    </div>
  );
}
const Banner3 = ({ text, fontSize }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={DefaultBanner4}
        alt=""
        className="w-full h-full object-cover z-8"
        loading="lazy"
      />
      <h1
        className={`absolute z-[11] top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${fontSize} uppercase whitespace-nowrap text-black font-['Gilroy']`}
      >
        {text}
      </h1>
    </div>
  );
};

const Banner4 = ({ text, fontSize }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={DefaultBanner3}
        alt=""
        className="w-full h-full object-cover z-8"
        loading="lazy"
      />
      <h1
        className={`absolute z-[11] top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${fontSize} uppercase whitespace-nowrap text-black font-['Founders_Grotesk_Condensed']`}
      >
        {text}
      </h1>
    </div>
  );
};

export default BannerEditor;
