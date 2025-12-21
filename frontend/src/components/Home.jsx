import React from "react";
import LeftHome from "./LeftHome";
import Feed from "./Feed";
import RightHome from "./RightHome";

function Home() {
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <LeftHome />
        <Feed />
        <RightHome />
      </div>
    </>
  );
}

export default Home;