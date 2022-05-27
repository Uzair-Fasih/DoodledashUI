/* global createjs */

const _ = require("lodash");
export default class CanvasActions {
  constructor(canvas, canvasProps) {
    this.canvas = canvas;
    this.stage = new createjs.Stage(canvas);

    this.stage.autoClear = false;
    this.stage.enableDOMEvents(true);

    this.ctx = canvas.getContext("2d");
    this.props = canvasProps;

    this.currentActions = [];
    this.isDrawing = false;

    this.setupInitData(canvasProps.init);

    // Settings for the canvas
  }

  setupInitData({ contributors: actions } = { contributors: [] }) {
    actions.forEach((action) => this.setShapeContainer(action));
    this.stage.update();
  }

  getRelativeCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    let clientX = 0,
      clientY = 0;

    if (event.type.startsWith("touch")) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = Math.floor(clientX - rect.left);
    const y = Math.floor(clientY - rect.top);
    return { x, y };
  }

  setShapeContainer({
    walletAddress,
    createdAt,
    id,
    drawing: { startX, startY, endX, endY },
  }) {
    const shape = new createjs.Shape();
    const shapeContainer = {
      shape,
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      graphics: shape.graphics,
      isSelected: false,
      nextTick: false,
      meta: {
        walletAddress,
        createdAt,
        id,
      },
    };

    shape.graphics.beginStroke("black");
    shape.graphics.moveTo(shapeContainer.start.x, shapeContainer.start.y);
    shape.graphics.lineTo(shapeContainer.end.x, shapeContainer.end.y);
    shape.graphics.closePath();

    shape.addEventListener("click", (event) => {
      const target = event.target;

      // Draw the target now with a highlight instead
      target.graphics.clear();
      this.stage.update();
      this.stage.clear();

      target.graphics.beginStroke("red");
      target.graphics.moveTo(shapeContainer.start.x, shapeContainer.start.y);
      target.graphics.lineTo(shapeContainer.end.x, shapeContainer.end.y);
      target.graphics.closePath();

      shapeContainer.isSelected = true;
      this.stage.update();
    });

    shape.addEventListener("tick", (event) => {
      if (!shapeContainer.isSelected) return;
      if (!shapeContainer.nextTick) {
        return (shapeContainer.nextTick = true);
      }

      const target = event.target;
      target.graphics.clear();
      this.stage.clear();

      target.graphics.beginStroke("black");
      target.graphics.moveTo(shapeContainer.start.x, shapeContainer.start.y);
      target.graphics.lineTo(shapeContainer.end.x, shapeContainer.end.y);
      target.graphics.closePath();

      shapeContainer.nextTick = false;
      shapeContainer.isSelected = false;
    });

    this.stage.addChild(shape);
  }

  getShapeContainer() {
    const shape = new createjs.Shape();
    const shapeContainer = {
      shape,
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
      graphics: shape.graphics,
      isSelected: false,
      nextTick: false,
    };

    shape.addEventListener("click", (event) => {
      const target = event.target;

      // Draw the target now with a highlight instead
      target.graphics.clear();
      this.stage.update();
      this.stage.clear();

      target.graphics.beginStroke("red");
      target.graphics.moveTo(shapeContainer.start.x, shapeContainer.start.y);
      target.graphics.lineTo(shapeContainer.end.x, shapeContainer.end.y);
      target.graphics.closePath();

      shapeContainer.isSelected = true;
      this.stage.update();
    });

    shape.addEventListener("tick", (event) => {
      if (!shapeContainer.isSelected) return;
      if (!shapeContainer.nextTick) {
        return (shapeContainer.nextTick = true);
      }

      const target = event.target;
      target.graphics.clear();
      this.stage.clear();

      target.graphics.beginStroke("black");
      target.graphics.moveTo(shapeContainer.start.x, shapeContainer.start.y);
      target.graphics.lineTo(shapeContainer.end.x, shapeContainer.end.y);
      target.graphics.closePath();

      shapeContainer.nextTick = false;
      shapeContainer.isSelected = false;
    });

    this.shapeContainer = shapeContainer;
    this.stage.addChild(shape);
  }

  beginDrawingLine(x, y) {
    if (this.isDrawing) return;
    this.isDrawing = true;

    this.getShapeContainer();

    this.currentActions.push(() => {
      this.shapeContainer.graphics.beginStroke("#000");
      this.shapeContainer.graphics.moveTo(x, y);
      this.shapeContainer.start = { x, y };
    });

    _.flow(this.currentActions)();
  }

  showStickyDrawingLine(x, y) {
    if (!this.isDrawing) return;

    const actions = [
      () => {
        this.shapeContainer.graphics.clear();
        this.stage.clear();
      },
      ...this.currentActions,
      () => {
        this.shapeContainer.graphics.lineTo(x, y);
        this.shapeContainer.graphics.closePath();
        this.stage.update();
        this.shapeContainer.end = { x, y };
      },
    ];

    // Draw the actions
    _.flow(actions)();
  }

  endDrawingLine(x, y) {
    if (!this.isDrawing) return;
    this.currentActions = [];
    this.shape = null;
    this.g = null;
    this.isDrawing = false;
  }

  // clearCanvas() {
  //   this.ctx.clearRect(0, 0, this.props.width, this.props.height);
  // }

  // saveCanvasData() {
  //   this.currentDrawData = this.ctx.getImageData(
  //     0,
  //     0,
  //     this.props.width,
  //     this.props.height
  //   );
  // }

  // restoreCanvasData() {
  //   this.ctx.putImageData(this.currentDrawData, 0, 0);
  // }
}
