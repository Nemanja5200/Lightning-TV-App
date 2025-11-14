import Lightning from '@lightningjs/sdk/src/Lightning'

export default class PlayerControls extends Lightning.Component {
  static _template() {
    return {
      w: 1690,
      h: 156,
      x: 115,
      y: 115,

      Back: {},
      RewindBack: {},
      SkipForward: {},
      ProgresBarr: {},
    }
  }
}
