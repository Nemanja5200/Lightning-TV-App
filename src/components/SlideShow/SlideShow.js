import Lightning from '@lightningjs/sdk/src/Lightning'

export default class Slideshow extends Lightning.Component {
  _images = []
  _currentIndex = 0
  _interval = null
  _transitionDuration = 5000

  static _template() {
    return {
      w: 1920,
      h: 697,
      CurrentImage: {
        w: 1920,
        h: 697,
        alpha: 1,
        zIndex: 1,
      },
      NextImage: {
        w: 1920,
        h: 697,
        alpha: 0,
        zIndex: 2,
      },
    }
  }

  set images(images) {
    this._images = images
    if (images && images.length > 0) {
      this._loadImage(this.tag('CurrentImage'), images[0])
      if (images.length > 1) {
        this._startSlideshow()
      }
    }
  }

  set transitionDuration(duration) {
    this._transitionDuration = duration
  }

  _loadImage(element, src) {
    element.patch({
      texture: {
        type: Lightning.textures.ImageTexture,
        src: src,
        resizeMode: {
          type: 'cover',
          w: 1920,
          h: 697,
          clipY: 0.5,
        },
      },
    })
  }

  _startSlideshow() {
    this._stopSlideshow()
    this._interval = setInterval(() => {
      this._transitionToNext()
    }, this._transitionDuration)
  }

  _stopSlideshow() {
    if (this._interval) {
      clearInterval(this._interval)
      this._interval = null
    }
  }

  setImagesOnFocues(images) {
    this._stopSlideshow()
    this._images = images
    this._currentIndex = 0

    if (images && images.length > 0) {
      this._loadImage(this.tag('CurrentImage'), images[0])
      this.tag('CurrentImage').patch({ alpha: 1 })
      this.tag('NextImage').patch({ alpha: 0 })
      if (images.length > 1) {
        this._startSlideshow()
      }
    }
  }

  _transitionToNext() {
    if (!this._images || this._images.length <= 1) return

    const currentImage = this.tag('CurrentImage')
    const nextImage = this.tag('NextImage')

    this._currentIndex = (this._currentIndex + 1) % this._images.length

    this._loadImage(nextImage, this._images[this._currentIndex])

    currentImage.setSmooth('alpha', 0, { duration: 0.8 })
    nextImage.setSmooth('alpha', 1, { duration: 0.8 })

    setTimeout(() => {
      currentImage.patch({
        texture: nextImage.texture,
        alpha: 1,
        zIndex: 1,
      })
      nextImage.patch({
        alpha: 0,
        zIndex: 2,
      })
    }, 800)
  }

  _detach() {
    this._stopSlideshow()
  }

  pause() {
    this._stopSlideshow()
  }

  resume() {
    if (this._images && this._images.length > 1) {
      this._startSlideshow()
    }
  }
}
