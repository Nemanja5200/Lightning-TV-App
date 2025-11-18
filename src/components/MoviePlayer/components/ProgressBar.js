import Lightning from '@lightningjs/sdk/src/Lightning'
import { formatTime } from '../../../utils/Functions'

export default class ProgressBar extends Lightning.Component {
  _skipInterval = null
  _skipAmount = 0
  _currentTime = 0
  _duration = 0
  _skipDirection = null
  _isHolding = false
  _holdTimeout = null

  static _template() {
    return {
      w: 1690,
      h: 156,
      CurrentTime: {
        x: 0,
        y: 0,
        text: {
          text: '00:00',
          fontSize: 26,
          fontFace: 'Inter-Bold',
          textColor: 0xffffffff,
        },
      },
      Bar: {
        x: 123,
        y: 10,
        w: 1404,
        h: 9,
        rect: true,
        color: 0xffd9d9d9,
        ProgressColor: {
          w: 0,
          h: 9,
          x: 0,
          y: 0,
          rect: true,
          color: 0xffed1c24,
        },
        Dot: {
          w: 21,
          h: 21,
          x: 0,
          y: 3,
          mount: 0.5,
          rect: true,
          alpha: 0,
          color: 0xffed1c24,
          shader: {
            type: Lightning.shaders.RoundedRectangle,
            radius: 10,
            stroke: 3,
            strokeColor: 0xffffffff,
          },
        },
      },
      RemainingTime: {
        x: 1600,
        y: 0,
        text: {
          text: '00:00',
          fontSize: 26,
          fontFace: 'Inter-Bold',
          textColor: 0xffffffff,
        },
      },
    }
  }

  updateProgress(currentTime, duration) {
    if (!isFinite(duration) || duration === 0) {
      return
    }

    this._currentTime = currentTime
    this._duration = duration

    this._displayTime =
      this._skipAmount !== 0
        ? Math.max(0, Math.min(duration, currentTime + this._skipAmount))
        : currentTime

    const remainingTime = Math.max(0, duration - this._displayTime)
    const progressBarWidth = (this._displayTime / duration) * 1404

    this.patch({
      CurrentTime: {
        text: { text: formatTime(this._displayTime) },
      },
      RemainingTime: {
        text: { text: `-${formatTime(remainingTime)}` },
      },
    })

    this.tag('ProgressColor').setSmooth('w', progressBarWidth, { duration: 0.2 })
    this.tag('Dot').setSmooth('x', progressBarWidth, { duration: 0.2 })
  }

  reset() {
    this._stopSkipping()
    this._skipAmount = 0
    this._currentTime = 0
    this._duration = 0
    this._isHolding = false

    if (this._holdTimeout) {
      clearTimeout(this._holdTimeout)
      this._holdTimeout = null
    }

    this.patch({
      CurrentTime: {
        text: { text: '00:00' },
      },
      RemainingTime: {
        text: { text: '00:00' },
      },
      Bar: {
        ProgressColor: { w: 0 },
        Dot: { x: 0, alpha: 0 },
      },
    })
  }

  _startSkipping(direction) {
    const skipIncrement = direction === 'forward' ? 5 : -5

    if (this._skipInterval) {
      clearInterval(this._skipInterval)
      this._skipInterval = null
    }

    this._skipAmount += skipIncrement
    const maxSkip = this._duration - this._currentTime
    const minSkip = -this._currentTime
    this._skipAmount = Math.max(minSkip, Math.min(maxSkip, this._skipAmount))
    this.updateProgress(this._currentTime, this._duration)

    this._skipInterval = setInterval(() => {
      this._skipAmount += skipIncrement

      const maxSkip = this._duration - this._currentTime
      const minSkip = -this._currentTime
      this._skipAmount = Math.max(minSkip, Math.min(maxSkip, this._skipAmount))

      this.updateProgress(this._currentTime, this._duration)
    }, 100)
  }
  _stopSkipping() {
    if (this._skipInterval) {
      clearInterval(this._skipInterval)
      this._skipInterval = null
    }

    if (this._skipInterval) {
      clearInterval(this._skipInterval)
      this._skipInterval = null
    }

    if (this._skipAmount !== 0) {
      this.signal('applySkip', this._skipAmount, this._currentTime + this._skipAmount)
      this._skipAmount = 0
    }
  }
  _focus() {
    this.tag('Dot').setSmooth('alpha', 1, { duration: 0.3 })
  }

  _unfocus() {
    this._stopSkipping()
    this.tag('Dot').setSmooth('alpha', 0, { duration: 0.3 })
  }

  _handleUp() {
    this._stopSkipping()
    return false
  }

  _handleLeft() {
    this._startSkipping('backward')
    return true
  }

  _handleRight() {
    this._startSkipping('forward')
    return true
  }

  _handleLeftRelease() {
    this._stopSkipping()
    return true
  }

  _handleRightRelease() {
    this._stopSkipping()
    return true
  }

  _handleDown() {
    this._stopSkipping()
    return true
  }
}
