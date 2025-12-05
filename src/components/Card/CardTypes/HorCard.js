import CardItem from '../Card'

export default class HorCard extends CardItem {
  static _template() {
    const parentTemplate = super._template()
    return {
      ...parentTemplate,
      w: 440,
      h: 330,
      zIndex: 5,
      Image: {
        w: (w) => w,
        h: (h) => h - 64,
      },
      Label: {
        ...parentTemplate.Label,
        w: 440,
        h: 43,
        x: 0,
        y: 0,
        mountX: 0,
        mountY: 0,
      },
    }
  }
}
