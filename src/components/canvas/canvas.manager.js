/* global createjs */
import _ from "lodash";
import alertEvent from "../alert/alertEvent";
import config from "./config.json";

export default class CanvasManager {
  // Setup methods
  constructor(canvas, data = []) {
    this.canvas = canvas;
    this.data = data;

    this.stage = getStage(canvas);
    this.setupCanvas();

    // action event listeners
    this.shape = null;
  }

  setupCanvas() {
    // Completely clear the canvas
    this.stage.clear();
    this.stage.removeAllChildren();
    this.stage.update();

    // Add all the existing data
    this.data.forEach((line) => {
      const { x1, y1, x2, y2 } = line;
      const shape = getShape(this.canvas, x1, y1, x2, y2);
      this.stage.addChild(shape);
    });

    this.stage.update();
  }

  // Interaction methods
  actionStart(event) {
    if (this.shape !== null) return;
    const { x, y } = getCoordinates(this.canvas, event);

    event.preventDefault();
    event.stopPropagation();

    this.shape = getShape(this.canvas, x, y, undefined, undefined, false);

    this.stage.addChild(this.shape);
    this.stage.update();
  }

  actionPreview(event) {
    if (this.shape == null) return;
    const { x, y } = getCoordinates(this.canvas, event);

    event.preventDefault();
    event.stopPropagation();
    this.stage.clear();

    this.shape.__endAt(x, y);
    this.stage.update();
  }

  async actionEnd(event) {
    if (this.shape == null) return;
    const { x, y } = getCoordinates(this.canvas, event);

    event.preventDefault();
    event.stopPropagation();
    this.stage.clear();

    this.shape.__endAt(x, y);
    this.stage.update();
    const shape = this.shape;
    this.shape = null;

    await alertEvent({
      type: "primary",
      title: "Would you like to confirm?",
      message: "This change is irreversible you know 🎃",
      acceptButtonText: "I am sure",
      onAccept: () => {
        this.data.push({
          x1: shape.__x1,
          y1: shape.__y1,
          x2: shape.__x2,
          y2: shape.__y2,
        });
      },
      rejectButtonText: "Lemme rethink",
      onReject: () => {
        this.stage.removeChild(shape);
        this.stage.clear();
        this.stage.update();
      },
    });
  }

  // Enable / disable

  enable() {
    const cm = this;
    this.stage.enableDOMEvents(true);
    this.canvas.addEventListener("mousedown", cm.actionStart.bind(cm));
    this.canvas.addEventListener("touchstart", cm.actionStart.bind(cm));
    this.canvas.addEventListener("mousemove", cm.actionPreview.bind(cm));
    this.canvas.addEventListener("touchmove", cm.actionPreview.bind(cm));
    this.canvas.addEventListener("mouseup", cm.actionEnd.bind(cm));
    this.canvas.addEventListener("touchend", cm.actionEnd.bind(cm));
  }

  disable() {
    const cm = this;
    this.stage.enableDOMEvents(false);
    this.canvas.removeEventListener("mousedown", cm.actionStart.bind(cm));
    this.canvas.removeEventListener("touchstart", cm.actionStart.bind(cm));
    this.canvas.removeEventListener("mousemove", cm.actionPreview.bind(cm));
    this.canvas.removeEventListener("touchmove", cm.actionPreview.bind(cm));
    this.canvas.removeEventListener("mouseup", cm.actionEnd.bind(cm));
    this.canvas.removeEventListener("touchend", cm.actionEnd.bind(cm));
  }
}

/**
 *  This method is called to create a custom stage
 * @param {*} canvas The canvas element to assign in the stage
 * @returns
 */
const getStage = (canvas) => {
  const stage = new createjs.Stage(canvas);

  stage.autoClear = false;
  stage.enableMouseOver();

  return stage;
};

const getShape = (canvas, x1, y1, x2, y2, shouldScale = true) => {
  const shape = new createjs.Shape();
  const scaleFactor = shouldScale ? canvas.width / config.length : 1;

  shape.cursor = "pointer";
  if (!_.isNil(x1) && !_.isNil(y1)) {
    shape.graphics.setStrokeStyle(1, "round").beginStroke(config.color);
    shape.graphics.moveTo(x1 * scaleFactor, y1 * scaleFactor);
  }

  if (!_.isNil(x2) && !_.isNil(y2)) {
    shape.graphics.lineTo(x2 * scaleFactor, y2 * scaleFactor);
    shape.graphics.closePath();
  }

  const reverseScaleFactor = config.length / canvas.width;
  // Custom methods
  shape.__x1 = x1 * reverseScaleFactor;
  shape.__y1 = y1 * reverseScaleFactor;
  shape.__x2 = x2 * reverseScaleFactor;
  shape.__y2 = y2 * reverseScaleFactor;

  shape.__endAt = (x2, y2) => {
    shape.graphics.clear();

    // const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // if (length < 2) return false;

    shape.graphics.beginStroke(config.color);
    shape.graphics.moveTo(x1 * scaleFactor, y1 * scaleFactor);
    shape.graphics.lineTo(x2 * scaleFactor, y2 * scaleFactor);
    shape.graphics.closePath();

    shape.__x2 = x2 * reverseScaleFactor;
    shape.__y2 = y2 * reverseScaleFactor;

    return true;
  };

  return shape;
};

const getCoordinates = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  let clientX = event.clientX;
  let clientY = event.clientY;

  if (event.type.startsWith("touch")) {
    clientX = event.changedTouches[0].clientX;
    clientY = event.changedTouches[0].clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
};
