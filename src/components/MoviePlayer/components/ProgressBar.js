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

  updateProgress(previewTime, duration) {
    if (!isFinite(duration) || duration === 0) {
      return
    }

    this._duration = duration

    this._displayTime = Math.max(0, Math.min(duration, previewTime))
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

    if (this._previewTime === undefined) {
      this._previewTime = this._currentTime
    }
    const applyIncrement = () => {
      this._previewTime += skipIncrement
      this._previewTime = Math.max(0, Math.min(this._duration, this._previewTime))
      this.updateProgress(this._previewTime, this._duration)
    }

    applyIncrement()
    this._skipInterval = setInterval(applyIncrement, 1000)
  }

  _stopSkipping() {
    if (this._skipInterval) {
      clearInterval(this._skipInterval)
      this._skipInterval = null
    }

    if (this._previewTime !== undefined) {
      this.signal('applySkip', this._previewTime)
      this._currentTime = this._previewTime
      this._previewTime = undefined
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
