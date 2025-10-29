export function padding(...values) {
  // Works like CSS shorthand:
  // padding(24) → all sides
  // padding(24, 16) → top/bottom, left/right
  // padding(24, 16, 8, 4) → top, right, bottom, left
  let [top, right, bottom, left] = [0, 0, 0, 0]

  switch (values.length) {
    case 1:
      top = right = bottom = left = values[0]
      break
    case 2:
      top = bottom = values[0]
      left = right = values[1]
      break
    case 3:
      top = values[0]
      right = left = values[1]
      bottom = values[2]
      break
    case 4:
      ;[top, right, bottom, left] = values
      break
    default:
      throw new Error('padding() expects 1–4 arguments')
  }

  return {
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  }
}
