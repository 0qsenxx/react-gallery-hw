import { BallTriangle } from "react-loader-spinner";

const Loader = () => (
  <BallTriangle
    height={100}
    width={100}
    radius={5}
    color="#4fa94d"
    ariaLabel="ball-triangle-loading"
    wrapperStyle={{}}
    wrapperClass="Loader"
    visible={true}
  />
);

export default Loader;
