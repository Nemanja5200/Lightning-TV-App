import { Utils, VideoPlayer } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { loader, unloader } from './components/HLS'
import PlayerButton from './components/PlayerButton'
import { IMAGE_PATH } from '../../constance/Images'
import { ELEMENTS } from '../../constance/Elements'

export default class MoviePlayer extends Lightning.Component {
  static _template() {
    return {
      Back: {
        type: PlayerButton,
        w: 86,
        h: 86,
        x: 115,
        y: 836,
        zIndex: 10,
      },
      Controls: {
        w: 312,
        h: 90,
        y: 836,
        x: 804,
        flex: { direction: 'row', alignItems: 'center' },
        Prev: {
          type: PlayerButton,
          w: 86,
          h: 86,
          flexItem: { marginRight: 45 },
          zIndex: 10,
        },
        PausePlay: {
          type: PlayerButton,
          w: 95,
          h: 95,
          flexItem: { marginRight: 45 },
          zIndex: 10,
        },
        Forward: {
          type: PlayerButton,
          w: 86,
          h: 86,
          zIndex: 10,
        },
      },
    }
  }

  get Back() {
    return this.tag('Back')
  }

  get Prev() {
    return this.tag('Controls.Prev')
  }

  get PausePlay() {
    return this.tag('Controls.PausePlay')
  }

  get Forward() {
    return this.tag('Controls.Forward')
  }

  _init() {
    console.log('MoviePlayer _init called')
    console.log('Back:', this.Back)
    console.log('Prev:', this.Prev)
    console.log('PausePlay:', this.PausePlay)
    console.log('Forward:', this.Forward)
    this.patch({
      Back: {
        icon: Utils.asset(IMAGE_PATH.PLAYAER_BACK_BTN),
      },
      Controls: {
        Prev: {
          icon: Utils.asset(IMAGE_PATH.PLAYER_PREV),
        },
        PausePlay: {
          icon: {
            src: Utils.asset(IMAGE_PATH.PLAYER_PAUSE),
            width: 70,
            height: 70,
          },
        },
        Forward: {
          icon: Utils.asset(IMAGE_PATH.PLAYER_FORWARD),
        },
      },
    })
    this._setState('Back')
  }

  _enable() {
    this.fireAncestors('$punchHole')
    VideoPlayer.position(0, 0)
    VideoPlayer.size(1920, 1080)
    VideoPlayer.consumer(this)
    VideoPlayer.loader(loader)
    VideoPlayer.unloader(unloader)
    VideoPlayer.loop(false)
    VideoPlayer.open('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8')
    VideoPlayer.play()
  }

  _disable() {
    this.fireAncestors('$unpunchHole')
    VideoPlayer.clear()
  }
  static _states() {
    return [
      class Back extends this {
        _getFocused() {
          return this.Back
        }

        _handleRight() {
          this._setState('Controls')
          return true
        }

        _handleEnter() {
          // Handle back button press
          console.log('Back pressed')
          // Router.back() or whatever action you want
          return true
        }
      },

      class Controls extends this {
        $enter() {
          this._controlIndex = 0 // Start at first control (Prev)
        }

        _getFocused() {
          const controls = [this.Prev, this.PausePlay, this.Forward]
          return controls[this._controlIndex]
        }

        _handleLeft() {
          if (this._controlIndex > 0) {
            this._controlIndex--
          } else {
            this._setState('Back')
          }
          return true
        }

        _handleRight() {
          if (this._controlIndex < 2) {
            // 2 is the last index (Forward)
            this._controlIndex++
          }
          return true
        }

        _handleEnter() {
          // Handle button press based on which control is focused
          const buttons = ['Prev', 'PausePlay', 'Forward']
          const focusedButton = buttons[this._controlIndex]
          console.log(`${focusedButton} pressed`)

          switch (focusedButton) {
            case 'Prev':
              // Handle previous
              break
            case 'PausePlay':
              // Handle pause/play
              break
            case 'Forward':
              // Handle forward
              break
          }
          return true
        }
      },
    ]
  }
}
