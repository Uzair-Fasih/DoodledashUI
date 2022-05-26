const _ = require("lodash");

export default class CanvasActions {
  constructor(canvas, canvasProps) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.props = canvasProps;
    this.currentActions = [];
    this.isDrawing = false;

    // Settings for the canvas
    this.ctx.imageSmoothingEnabled = false;
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

  beginDrawingLine(x, y) {
    this.isDrawing = true;
    this.currentActions.push((ctx) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      return ctx;
    });
  }

  showStickyDrawingLine(x, y) {
    if (!this.isDrawing) return;
    // Get current data before adding the elastic line
    if (!this.currentDrawData) this.saveCanvasData();
    this.clearCanvas(); // Clear the canvas
    if (this.currentDrawData) this.restoreCanvasData();

    // Draw the actions
    _.flow(
      this.currentActions.concat([
        (ctx) => {
          ctx.lineTo(x, y);
          ctx.closePath();
          ctx.stroke();
          return ctx;
        },
      ])
    )(this.ctx);
  }

  endDrawingLine(x, y) {
    if (!this.isDrawing) return;
    this.currentActions.push((ctx) => {
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();
      return ctx;
    });

    _.flow(this.currentActions)(this.ctx);
    this.currentDrawData = null;
    this.currentActions = [];
    this.isDrawing = false;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
  }

  saveCanvasData() {
    this.currentDrawData = this.ctx.getImageData(
      0,
      0,
      this.props.width,
      this.props.height
    );
  }

  restoreCanvasData() {
    this.ctx.putImageData(this.currentDrawData, 0, 0);
  }
}
