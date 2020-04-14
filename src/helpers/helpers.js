module.exports = class Helpers
{
  static hexToRgb (h)
  {
    let color = this.cutHex(h),
        r = parseInt(color.substring(0, 2), 16),
        g = parseInt(color.substring(2, 4), 16),
        b = parseInt(color.substring(4, 6), 16)

    return {
      r: this.roundDown(r / 255, 3),
      g: this.roundDown(g / 255, 3),
      b: this.roundDown(b / 255, 3),
      a: 1
    }
  }

  static cutHex (h)
  {
    return h.charAt(0) === '#' ? h.substring(1, 7) : h
  }

  static roundDown (number, decimals)
  {
    decimals = decimals || 0
    return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
}