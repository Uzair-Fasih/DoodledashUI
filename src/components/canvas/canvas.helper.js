import _ from "lodash";

const silenceEvent = (event) => {
  event.preventDefault();
  event.stopPropagation();
};
const d = new Date();
d.setSeconds(d.getSeconds() + 5);
export const initState = {
  popupTip: {},
  confirmPrompt: {},
  isLocked: false,
  isMobile: false,
  lockType: null,
  availableAt: d.toJSON(), //"2022-05-28T11:10:32.082Z", //
  renderKey: 0,
};

export const canvasProps = {
  height: 540,
  width: 540,
  style: { backgroundColor: "#fff" },
};

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "popup-tip":
      return Object.assign({}, state, {
        popupTip: { ...payload, show: true },
      });
    case "confirmation-prompt":
      return Object.assign({}, state, {
        confirmPrompt: { ...payload, show: true },
      });
    case "set-canvas-lock":
      return Object.assign({}, state, {
        isLocked: payload,
      });
    case "set-is-mobile":
      return Object.assign({}, state, {
        isMobile: payload,
      });
    case "render":
      console.log("forcing render");
      return Object.assign({}, state, {
        renderKey: state.renderKey + 1,
      });
    default:
      return state;
  }
};

export const getHandler = (actions) => {
  if (!actions) return console.error("No actions available");

  const handler = {
    mousedown(event) {
      const { x, y } = actions.getRelativeCoordinates(event);
      actions.beginDrawingLine(x, y);
    },
    mousemove(event) {
      const { x, y } = actions.getRelativeCoordinates(event);
      actions.showStickyDrawingLine(x, y);
    },
    mouseup(event) {
      const { x, y } = actions.getRelativeCoordinates(event);
      actions.endDrawingLine(x, y);
    },
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
