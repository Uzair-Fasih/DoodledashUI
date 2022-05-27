/**
 * The main canvas component. The canvas can be initialized with current draw data.
 * The canvas should be workable on any screen size. The size of the canvas is the standard size for NFTs
 */

import _ from "lodash";
import React, { useEffect, useRef } from "react";
import CanvasActions from "./canvasActions";
import canvasData from "../../../test/canvasData.json";

import "./canvas.css";

const canvasProps = {
  height: 540,
  width: 540,
  style: { backgroundColor: "#f8f9fa" },
};

export default function Canvas() {
  const canvasRef = useRef();
  const actions = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    actions.current = new CanvasActions(canvas, {
      ...canvasProps,
      init: canvasData,
    });
    const handler = getHandler(actions.current);

    canvas.addEventListener("mousedown", handler.mousedown, false);
    canvas.addEventListener("touchstart", handler.touchstart, false);

    canvas.addEventListener("mousemove", handler.mousemove, false);
    canvas.addEventListener("touchmove", handler.touchmove, false);

    canvas.addEventListener("mouseup", handler.mouseup, false);
    canvas.addEventListener("touchend", handler.touchend, false);

    return () => {
      canvas.removeEventListener("mousedown", handler.mousedown, false);
      canvas.removeEventListener("touchstart", handler.touchstart, false);

      canvas.removeEventListener("mousemove", handler.mousemove, false);
      canvas.removeEventListener("touchmove", handler.touchmove, false);

      canvas.removeEventListener("mouseup", handler.mouseup, false);
      canvas.removeEventListener("touchend", handler.touchend, false);
    };
  });

  return (
    <canvas ref={canvasRef} id="mystery-machine" {...canvasProps}></canvas>
  );
}

const getHandler = (actions) => {
  const handler = {
    mousedown(event) {
      if (!actions) return console.error("No actions available");
      const { x, y } = actions.getRelativeCoordinates(event);
      actions.beginDrawingLine(x, y);
    },
    mousemove(event) {
      if (!actions) return console.error("No actions available");
      const { x, y } = actions.getRelativeCoordinates(event);
      actions.showStickyDrawingLine(x, y);
    },
    mouseup(event) {
      if (!actions) return console.error("No actions available");
      const { x, y } = actions.getRelativeCoordinates(event);
      actions.endDrawingLine(x, y);
    },
  };

  const silenceEvent = function (event) {
    event.preventDefault();
    event.stopPropagation();
  };

  const touchHander = {
    touchstart(event) {
      silenceEvent(event);
      return handler.mousedown(event);
    },
    touchmove(event) {
      silenceEvent(event);
      return handler.mousemove(event);
    },
    touchend(event) {
      silenceEvent(event);
      return handler.mouseup(event);
    },
  };

  return _.merge({}, handler, touchHander);
};
