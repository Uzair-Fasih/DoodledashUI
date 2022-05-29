/**
 * The main canvas component. The canvas can be initialized with current draw data.
 * The canvas should be workable on any screen size. The size of the canvas is the standard size for NFTs
 */

import React, {
  useEffect,
  useRef,
  useState,
  useReducer,
  useContext,
} from "react";

import TimeLocked from "../time-locked-canvas/TimeLocked";
import LoginLocked from "../login-locked-canvas/LoginLocked";
import ConfirmationPrompt from "../confirmation-prompt/ConfirmationPrompt";
import PopupTip from "../popup-tip/PopupTip";

import { getHandler, reducer, initState, canvasProps } from "./canvas.helper";
import CanvasActions from "./canvasActions";

import "./canvas.css";
import AuthContext from "../../context/Auth";

export default function CanvasWithReducer(props) {
  const [state, dispatch] = useReducer(reducer, initState);
  return <Canvas {...props} state={state} dispatch={dispatch} />;
}

const Canvas = ({ contributors, state, dispatch, toggleConnectWallet }) => {
  const canvasRef = useRef();
  const actions = useRef();
  const [auth] = useContext(AuthContext);
  const walletId = useRef();
  const [viewportWidth, setViewportWidth] = useState(
    Math.min(document.documentElement.clientWidth, 540)
  );

  const getScaledContributors = () => {
    const scaleFactor = viewportWidth / 540;
    const scaledContributors = contributors.map(({ drawing, ...props }) => {
      return {
        ...props,
        drawing: {
          type: drawing.type,
          startX: drawing.startX * scaleFactor,
          startY: drawing.startX * scaleFactor,
          endX: drawing.endX * scaleFactor,
          endY: drawing.endY * scaleFactor,
        },
      };
    });
    return scaledContributors;
  };

  useEffect(() => {
    walletId.current = auth.walletId;
  }, [auth, auth.walletId]);

  useEffect(() => {
    const resizeHandler = () => {
      setViewportWidth(Math.min(document.documentElement.clientWidth, 540));
      dispatch({ type: "popup-tip", payload: {} });
      if (actions.current) actions.current.stage.update();
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [dispatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scaledContributors = getScaledContributors();

    actions.current = new CanvasActions(
      canvas,
      {
        colors: { accent: "red", regular: "black" },
        initData: scaledContributors,
        walletId,
      },
      {
        toggleConnectWallet,
        showPopupTip: (popupTip) => {
          dispatch({ type: "popup-tip", payload: popupTip });
        },
        showConfirmationPrompt: (confirmPrompt) => {
          dispatch({ type: "set-canvas-lock", payload: true });
          dispatch({
            type: "confirmation-prompt",
            payload: {
              prompt: confirmPrompt.prompt,
              callback: (...props) => {
                confirmPrompt.callback(...props);
                dispatch({ type: "set-canvas-lock", payload: false });
              },
            },
          });
        },
      }
    );

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
  }, [contributors, state.renderKey, viewportWidth]);

  return (
    <React.Fragment>
      <ConfirmationPrompt {...state.confirmPrompt} />
      <PopupTip {...state.popupTip} />

      <TimeLocked
        availableAt={state.availableAt}
        forceRender={() => dispatch({ type: "render" })}
      >
        <LoginLocked toggleConnectWallet={toggleConnectWallet}>
          <canvas
            className="mystery-machine"
            ref={canvasRef}
            {...canvasProps}
            width={viewportWidth}
            height={viewportWidth}
          ></canvas>
        </LoginLocked>
      </TimeLocked>
    </React.Fragment>
  );
};
