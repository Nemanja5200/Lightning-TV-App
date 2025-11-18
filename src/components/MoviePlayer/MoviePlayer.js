import { Router, Utils, VideoPlayer } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { loader, unloader } from './components/HLS'
import PlayerButton from './components/PlayerButton'
import { IMAGE_PATH } from '../../constance/Images'
import { ELEMENTS } from '../../constance/Elements'
import { PATHS } from '../../constance/paths'
import { ProgressBar } from '@lightningjs/ui-components'
import { formatTime } from '../../utils/Functions'

export default class MoviePlayer extends Lightning.Component {
  _isPaused = false
  _CurrentTime = '00:00'
  _Duration = '00:00'
  _RemaningTime = '00:00'
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

      ProgressBar: {
        w: 1690,
        h: 156,
        x: 115,
        y: 961,
        zIndex: 10,
        CurrentTime: {
          x: 0,
          y: 0,
          text: {
            text: '00:00',
            fontSize: 26,
            fontFace: 'Inter-Bold',
            textColor: 0xffffffff,
          },
          zIndex: 10,
        },
        Bar: {},
        RemaningTime: {
          x: 1600,
          y: 0,
          text: {
            text: '00:00',
            fontSize: 26,
            fontFace: 'Inter-Bold',
            textColor: 0xffffffff,
          },
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

  get ProgressBar() {
    return this.tag('ProgressBar')
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

  _active() {
    this.patch({
      ProgressBar: {
        CurrentTime: {
          text: { text: this._CurrentTime },
        },

        RemaningTime: {
          text: { text: this._Duration },
        },
      },
    })
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

  _updateProgress() {
    const currentTime = VideoPlayer.currentTime || 0
    const duration = VideoPlayer.duration || 0
    const remaningTime = Math.max(0, duration - currentTime)

    if (!isFinite(duration) || duration < 0) {
      return
    }

    this._CurrentTime = currentTime
    this._Duration = duration
    this._RemaningTime = remaningTime

    this.patch({
      ProgressBar: {
        CurrentTime: {
          text: { text: formatTime(this._CurrentTime) },
        },
        RemaningTime: {
          text: { text: formatTime(this._RemaningTime) },
        },
      },
    })
  }

  _startProgressUpdates() {
    this._stopProgressUpdates()

    this._updateProgress()

    this._progressInterval = setInterval(() => {
      this._updateProgress()
    }, 1000)
  }

  _stopProgressUpdates() {
    if (this._progressInterval) {
      clearInterval(this._progressInterval)
      this._progressInterval = null
    }
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
    this._startProgressUpdates()
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
