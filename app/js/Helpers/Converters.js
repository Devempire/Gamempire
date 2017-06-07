export class ScreenRatioConverter {
  /**
   * Take width/height in ratio to convert pixel sizes. E.g. you konw the screen is 16:9 with width 1920px, and want to
   * find the height
   * @param width width ratio
   * @param height height ratio
   */
  constructor (width, height) {
    this.width = width;
    this.height = height;
  }

  getHeightFromWidth (width) {
    return Math.ceil((width * this.height) / this.width);
  }

  getWidthFromHeight (height) {
    return Math.ceil((height * this.width) / this.height);
  }
}
