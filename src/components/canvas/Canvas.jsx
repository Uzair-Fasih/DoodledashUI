/**
 * The main canvas component. The canvas can be initialized with current draw data.
 * The canvas should be workable on any screen size. The size of the canvas is the standard size for NFTs
 */

import _ from "lodash";
import React, {
  useEffect,
  useRef,
  useState,
  useReducer,
  useContext,
} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import TimeLocked from "../time-locked-canvas/TimeLocked";
import LoginLocked from "../login-locked-canvas/LoginLocked";
import ConfirmationPrompt from "../confirmation-prompt/ConfirmationPrompt";
import PopupTip from "../popup-tip/PopupTip";

import { getHandler, reducer, initState, canvasProps } from "./canvas.helper";
import CanvasActions from "./canvasActions";

import "./canvas.css";
import AuthContext from "../../context/Auth";

const meta = {
  walletAddress: "0x686800b7e090271c922450C47Ad30C2702C7bfE9",
  createdAt: new Date().toJSON(),
};

export default function CanvasWithReducer(props) {
  const [state, dispatch] = useReducer(reducer, initState);
  return <Canvas {...props} state={state} dispatch={dispatch} />;
}

const Canvas = ({ contributors, state, dispatch, toggleConnectWallet }) => {
  const canvasRef = useRef();
  const actions = useRef();
  const [auth] = useContext(AuthContext);
  const [isPanningDisabled, setPanningDisable] = useState(true);

  const toggleFABCallback = () => {
    if (isPanningDisabled) setPanningDisable(false);
    else setPanningDisable(true);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    actions.current = new CanvasActions(
      canvas,
      {
        colors: { accent: "red", regular: "black" },
        initData: contributors,
        meta: auth,
      },
      {
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
  }, [contributors, state.renderKey]);

  useEffect(() => {
    const resizeHandler = () => {
      const viewportWidth = document.documentElement.clientWidth;
      dispatch({ type: "popup-tip", payload: {} });
      if (actions.current) actions.current.stage.update();
      if (viewportWidth <= 540) {
        dispatch({ type: "set-is-mobile", payload: true });
        setPanningDisable(false);
      } else {
        dispatch({ type: "set-is-mobile", payload: false });
        setPanningDisable(true);
      }
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <React.Fragment>
      <ConfirmationPrompt {...state.confirmPrompt} />
      <PopupTip {...state.popupTip} />
      {state.isMobile && (
        <FloatingActionButton
          isLocked={isPanningDisabled || state.isLocked}
          callback={toggleFABCallback}
        />
      )}

      <TimeLocked
        availableAt={state.availableAt}
        forceRender={() => dispatch({ type: "render" })}
      >
        <LoginLocked toggleConnectWallet={toggleConnectWallet}>
          <TransformWrapper
            pinch={{ disabled: true }}
            doubleClick={{ disabled: true }}
            wheel={{ disabled: true }}
            panning={{ disabled: isPanningDisabled }}
          >
            <TransformComponent
              wrapperClass={"mystery-machine"}
              wrapperStyle={{
                backgroundColor: canvasProps.style.backgroundColor,
                "--after-content":
                  isPanningDisabled && !state.isLocked ? "none" : "block",
              }}
            >
              <canvas ref={canvasRef} {...canvasProps}></canvas>
            </TransformComponent>
          </TransformWrapper>
        </LoginLocked>
      </TimeLocked>
    </React.Fragment>
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
