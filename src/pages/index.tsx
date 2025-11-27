import type { NextPage } from "next";
import { LaunchPad } from "../screens/LaunchPad";

const Home: NextPage = () => {

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LaunchPad />
    </div>
  );
};

export default Home;