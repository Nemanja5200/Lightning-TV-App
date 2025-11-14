import { Router, Utils, VideoPlayer } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { loader, unloader } from './components/HLS'
import PlayerButton from './components/PlayerButton'
import { IMAGE_PATH } from '../../constance/Images'
import { ELEMENTS } from '../../constance/Elements'
import { PATHS } from '../../constance/paths'

export default class MoviePlayer extends Lightning.Component {
  _isPaused = false
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

  _updatePlayPauseIcon() {
    this.PausePlay.patch({
      icon: {
        src: this._isPaused
          ? Utils.asset(IMAGE_PATH.PLAYER_PLAY)
          : Utils.asset(IMAGE_PATH.PLAYER_PAUSE),
        width: 70,
        height: 70,
      },
    })
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
          this._handleBack()
          return true
        }

        _handleBack() {
          const history = Router.getHistory()

          if (history.length) {
            Router.back()
          } else {
            Router.navigate(PATHS.HOME)
          }
        }
      },

      class Controls extends this {
        $enter() {
          this._controlIndex = 0
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
            this._controlIndex++
          }
          return true
        }

        _handleEnter() {
          const buttons = ['Prev', 'PausePlay', 'Forward']
          const focusedButton = buttons[this._controlIndex]

          switch (focusedButton) {
            case 'Prev':
              if (!this._isPaused) VideoPlayer.skip(-10)
              break
            case 'PausePlay':
              this._isPaused = !this._isPaused
              VideoPlayer.playPause()
              this._updatePlayPauseIcon()
              break
            case 'Forward':
              if (!this._isPaused) VideoPlayer.skip(10)
              break
          }
          return true
        }
      },
    ]
  }
}
