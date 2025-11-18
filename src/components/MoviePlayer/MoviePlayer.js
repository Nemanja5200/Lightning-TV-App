import { Router, Utils, VideoPlayer } from '@lightningjs/sdk'
import Lightning from '@lightningjs/sdk/src/Lightning'
import { loader, unloader } from './components/HLS'
import PlayerButton from './components/PlayerButton'
import { IMAGE_PATH } from '../../constance/Images'
import { PATHS } from '../../constance/paths'
import ProgressBar from './components/ProgressBar'

export default class MoviePlayer extends Lightning.Component {
  _isPaused = false
  _progressInterval = null

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
        type: ProgressBar,
        x: 115,
        y: 961,
        signals: {
          seekForward: '_seekForward',
          seekBackward: '_seekBackward',
        },
        zIndex: 10,
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

    if (!isFinite(duration) || duration === 0) {
      return
    }

    this.ProgressBar.updateProgress(currentTime, duration)
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

  _resetUI() {
    this._isPaused = false
    this.ProgressBar.reset()
    this.patch({
      Controls: {
        PausePlay: {
          icon: {
            src: Utils.asset(IMAGE_PATH.PLAYER_PAUSE),
            width: 70,
            height: 70,
          },
        },
      },
    })
  }

  _enable() {
    this._resetUI()
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
    this._stopProgressUpdates()
    VideoPlayer.clear()
    this._resetUI()
  }
  _seekBackward() {
    VideoPlayer.skip(-10)
  }

  _seekForward() {
    VideoPlayer.skip(10)
  }

  _seekBackward() {
    VideoPlayer.skip(-10)
  }

  _seekForward() {
    VideoPlayer.skip(10)
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

        _handleDown() {
          this._setState('ProgressBar')
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

        _handleDown() {
          this._setState('ProgressBar')
          return true
        }

        _handleEnter() {
          const buttons = ['Prev', 'PausePlay', 'Forward']
          const focusedButton = buttons[this._controlIndex]

          switch (focusedButton) {
            case 'Prev':
              VideoPlayer.skip(-10)
              break
            case 'PausePlay':
              this._isPaused = !this._isPaused
              VideoPlayer.playPause()
              this._updatePlayPauseIcon()
              break
            case 'Forward':
              VideoPlayer.skip(10)
              break
          }
          return true
        }
      },

      class ProgressBar extends this {
        _getFocused() {
          return this.ProgressBar
        }

        _handleUp() {
          this._setState('Controls')
          return true
        }
      },
    ]
  }
}
