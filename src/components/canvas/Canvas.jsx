/**
 * The main canvas component. The canvas can be initialized with current draw data.
 * The canvas should be workable on any screen size. The size of the canvas is the standard size for NFTs
 */

import React, { useEffect, useRef, useState, useContext } from "react";

import TimeLocked from "./locks/time";
import LoginLocked from "./locks/login";

import config from "./config.json";
import CanvasManager from "./canvas.manager";

import AuthContext from "../../context/Auth";

import "./canvas.css";
// import Instruction from "../instruction";
import baseApi from "../../utilities/axios";
import _ from "lodash";

const Canvas = ({ data }) => {
  const [auth] = useContext(AuthContext);
  const canvasRef = useRef();
  const canvasManager = useRef();

  const [canvasSideLength, setCanvasSideLength] = useState(
    Math.min(document.documentElement.clientWidth - 20, config.length)
  );

  const resizeHandler = () => {
    if (!canvasManager.current) return;
    const sideLength = Math.min(
      document.documentElement.clientWidth - 20,
      config.length
    );
    setCanvasSideLength(sideLength);

    // Hack to force the func execution into envent loop
    // process at the end of the execution
    setTimeout(() => {
      canvasManager.current.setupCanvas();
    });
  };

  // Initial setup of the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!canvasManager.current)
      canvasManager.current = new CanvasManager(
        canvasRef.current,
        data.lineList
      );

    // Handle resize
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canvasManager.current) return;
    if (!!auth.walletId) canvasManager.current.enable();
    else canvasManager.current.disable();
  }, [auth.walletId]);

  return (
    <canvas
      className="mystery-machine"
      width={canvasSideLength}
      height={canvasSideLength}
      ref={canvasRef}
    ></canvas>
  );
};

const CanvasWidget = () => {
  const [data, setData] = useState({ data: {}, isLoaded: false });
  // const instruction = {
  //   title: "Take part in art",
  //   message: "Draw a line on the canvas to leave your mark on the doodle.",
  // };

  useEffect(() => {
    if (data.isLoaded) return;

    const getData = async () => {
      try {
        const response = await baseApi.get("/art/active");
        setData((state) => ({
          ...state,
          data: _.get(response, "data.data", {}),
          isLoaded: true,
        }));
      } catch (err) {
        setData((state) => ({ ...state, isLoaded: true }));
      }
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data.isLoaded) return;

  return (
    <TimeLocked>
      <LoginLocked>
        <div className="canvas-container">
          <Canvas data={data.data} />
        </div>
      </LoginLocked>
    </TimeLocked>
  );
};

// <div className="instruction-container">
//   <Instruction {...instruction} />
// </div>;

export default CanvasWidget;
