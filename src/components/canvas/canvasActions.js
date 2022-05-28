/* global createjs */

const _ = require("lodash");
export default class CanvasActions {
  constructor(canvas, props, actions) {
    this.canvas = canvas;
    this.stage = new createjs.Stage(canvas);

    this.stage.autoClear = false;
    this.stage.enableDOMEvents(true);
    this.stage.enableMouseOver();

    this.ctx = canvas.getContext("2d");
    this.props = props;
    this.actions = actions;

    this.currentActions = [];
    this.isDrawing = false;
    this.isLocked = false;

    this.setupInitData(props.initData);
  }

  setupInitData(actions = []) {
    actions.forEach((action) => {
      const { shape } = this.getShapeContainer({
        ...action,
        isPrepopulated: true,
      });
      this.stage.addChild(shape);
    });

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

  getShapeContainer(
    {
      meta,
      drawing: { startX = 0, startY = 0, endX = 0, endY = 0 },
      isPrepopulated = false,
    } = { drawing: {} }
  ) {
    const shape = new createjs.Shape();
    shape.cursor = "pointer";
    const shapeContainer = {
      meta,
      shape,
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      graphics: shape.graphics,
      isSelected: false,
      nextTick: false,
    };

    if (isPrepopulated) {
      shape.graphics.beginStroke(this.props.colors.regular);
      shape.graphics.moveTo(shapeContainer.start.x, shapeContainer.start.y);
      shape.graphics.lineTo(shapeContainer.end.x, shapeContainer.end.y);
      shape.graphics.closePath();
    }

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

      const { clientX, clientY } = event.nativeEvent;
      this.actions.showPopupTip({
        ...shapeContainer.meta,
        clientX,
        clientY,
      });
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
      this.actions.showPopupTip({});
    });

    return shapeContainer;
  }

  beginDrawingLine(x, y) {
    this.stage.update();
    if (this.isLocked) return;
    if (this.isDrawing) return;
    this.isDrawing = true;

    const shapeContainer = this.getShapeContainer({
      meta: {
        walletId: this.props.walletId.current,
        createdAt: new Date().toJSON(),
      },
      drawing: {},
    });
    this.stage.addChild(shapeContainer.shape);
    this.shapeContainer = shapeContainer;

    this.currentActions.push(() => {
      this.shapeContainer.graphics.beginStroke("#000");
      this.shapeContainer.graphics.moveTo(x, y);
      this.shapeContainer.start = { x, y };
    });

    _.flow(this.currentActions)();
  }

  showStickyDrawingLine(x, y) {
    if (this.isLocked) return;
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
        this.shapeContainer.isShape = true;
      },
    ];

    // Draw the actions
    _.flow(actions)();
  }

  endDrawingLine() {
    if (!this.isDrawing) return;
    this.currentActions = [];

    if (this.shapeContainer.isShape) {
      if (!this.props.walletId.current) {
        this.stage.removeChild(this.shapeContainer.shape);
        this.shapeContainer.shape.graphics.clear();
        this.actions.toggleConnectWallet();
        this.stage.clear();
        this.stage.update();
      } else {
        this.actions.showConfirmationPrompt({
          prompt: "Are you sure you'd like to set this line?",
          callback: (val) => {
            this.isLocked = val;
            if (!val) {
              this.stage.removeChild(this.shapeContainer.shape);
              this.shapeContainer.shape.graphics.clear();
            }
            this.stage.clear();
            this.stage.update();
          },
        });
      }
    }

    this.shape = null;
    this.g = null;
    this.isDrawing = false;
  }
}
