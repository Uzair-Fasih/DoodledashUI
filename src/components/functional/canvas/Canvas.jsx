/**
 * The main canvas component. The canvas can be initialized with current draw data.
 * The canvas should be workable on any screen size. The size of the canvas is the standard size for NFTs
 */

import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CanvasActions from "./canvasActions";

import "./canvas.css";

const meta = {
  walletAddress: "0x686800b7e090271c922450C47Ad30C2702C7bfE9",
  createdAt: new Date().toJSON(),
};

export default function Canvas({ contributors }) {
  const canvasRef = useRef();
  const actions = useRef();
  const [selectedLine, setSelectedLine] = useState({});
  const [showConfirm, toggleConfirm] = useState({});
  const [isMobile, setMobile] = useState(false);
  const [options, setOptions] = useState({
    pinch: { disabled: true },
    doubleClick: { disabled: true },
    panning: { disabled: true },
    wheel: { disabled: true },
  });

  const canvasProps = {
    height: 540,
    width: 540,
    style: { backgroundColor: "#f8f9fa" },
  };

  const toggleFABCallback = () => {
    const isLocked = options.panning.disabled;
    if (isLocked) {
      setOptions(_.merge({}, options, { panning: { disabled: false } }));
      actions.current.stage.enableDOMEvents(false);
    } else {
      setOptions(_.merge({}, options, { panning: { disabled: true } }));
      actions.current.stage.enableDOMEvents(true);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    actions.current = new CanvasActions(canvas, {
      ...canvasProps,
      colors: { accent: "red", regular: "black" },
      initData: contributors,
      setPopupStatus: setSelectedLine,
      toggleConfirm,
      meta,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedLine, contributors]);

  useEffect(() => {
    const resizeHandler = () => {
      console.log("Called resize handler");
      const viewportWidth = document.documentElement.clientWidth;
      if (viewportWidth <= 540) {
        setMobile(true);
        setOptions(_.merge({}, options, { panning: { disabled: false } }));
        actions.current.stage.enableDOMEvents(false);
      } else {
        setMobile(false);
        setOptions(_.merge({}, options, { panning: { disabled: true } }));
        actions.current.stage.enableDOMEvents(true);
      }
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <React.Fragment>
      {!_.isEmpty(showConfirm) && <ConfirmationPrompt data={showConfirm} />}
      {!_.isEmpty(selectedLine) && <PopupTip data={selectedLine} />}

      {isMobile && (
        <FloatingActionButton
          isLocked={options.panning.disabled}
          callback={toggleFABCallback}
        />
      )}
      <TransformWrapper {...options}>
        <TransformComponent
          wrapperClass={"mystery-machine"}
          wrapperStyle={{
            "--after-content": options.panning.disabled ? "none" : "block",
            backgroundColor: "#f8f9fa",
          }}
        >
          <canvas ref={canvasRef} {...canvasProps}></canvas>
        </TransformComponent>
      </TransformWrapper>
    </React.Fragment>
  );
}

const PopupTip = ({ data }) => {
  const { clientX, clientY } = data.event.nativeEvent;
  return (
    <div
      className="popup"
      style={{
        left: `${clientX + 20}px`,
        top: `${clientY}px`,
      }}
    >
      <p>Added by:</p>
      <p>{data.walletAddress}</p>
      <p>{data.createdAt}</p>
    </div>
  );
};

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

const ConfirmationPrompt = ({ data }) => {
  const { callback = _.noop } = data;
  return (
    <div className="confirmation">
      Are you sure you'd like to set this line?
      <div className="confirmation-call-to-actions">
        <button onClick={() => callback(true)}>Continue</button>
        <button className="secondary" onClick={() => callback(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const FloatingActionButton = ({ isLocked, callback = _.noop }) => {
  return (
    <div className="floating-action-button" onClick={callback}>
      <img
        src={`/icons/lock-${isLocked ? "on" : "off"}.svg`}
        alt="floating-action-button"
      />
    </div>
  );
};
