import Lightning from '@lightningjs/sdk/src/Lightning'
import { Label } from '@lightningjs/ui-components'
import { MoviePlayer } from '../../components'

export default class PlayerPage extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      Player: {
        type: MoviePlayer,
      },
    }
  }
}
