import Lightning from '@lightningjs/sdk/src/Lightning'
import HorizontalContainer from '../components/HorizontalContainer/HorizontalContainer'
import Card from '../components/Card/Card'
import { Utils } from '@lightningjs/sdk'
import VerticalContainer from '../components/VerticalContainer/VerticalContainer'

export default class Home extends Lightning.Component {
  static _template() {
    return {
      x: 0,
      y: 0,
      Background: {
        w: 1920,
        h: 1080,
        zIndex: -1,
      },
      Wrapper: {
        type: VerticalContainer,
        x: 64,
        y: 125,
        w: 1241,
      },
    }
  }

  _init() {
    const data = [
      { title: 'Movie 1', image: 'images/movie1.png' },
      { title: 'Movie 2', image: 'images/movie1.png' },
      { title: 'Movie 3', image: 'images/movie1.png' },
      { title: 'Movie 4', image: 'images/movie1.png' },
      { title: 'Movie 5', image: 'images/movie1.png' },
    ]

    const cardItems = data.map((item) => ({
      type: Card,
      item,
    }))

    const rows = [
      {
        type: HorizontalContainer,
        w: 1241,
        h: 464,
        props: {
          items: cardItems,
          railTitle: 'Movies',
          h: 359,
        },
      },
      {
        type: HorizontalContainer,
        w: 1241,
        h: 464,
        props: {
          items: cardItems,
          railTitle: 'Series',
          h: 359,
        },
      },
    ]

    this.tag('Wrapper').patch({
      props: {
        items: rows,
      },
    })
  }

  set background(data) {
    this.tag('Background').patch({
      src: Utils.asset(data.image),
      zIndex: data.zIndex ?? -100,
    })
  }

  _getFocused() {
    return this.tag('Wrapper')
  }
}
