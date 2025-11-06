import CardItem from '../Card'

export default class VerCard extends CardItem {
  static _template() {
    const parentTemplate = super._template()
    return {
      ...parentTemplate,
      w: 241,
      h: 359,
      Label: {
        ...parentTemplate.Label,
        w: 241,
        h: 49,
        x: 0,
        y: 0,
        mountX: 0,
        mountY: 0,
      },
    }
  }
}
