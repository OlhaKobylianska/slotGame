export interface iAssetsMap {
  sptites: { name: string, url: string }[]
}

export interface iReals {
  container: PIXI.Container,
  symbols: PIXI.Sprite[],
  position: string | number,
  previousPosition: number,
  blur: PIXI.filters.BlurFilter
}

export interface iTween {
  object: iReals,
  property: string,
  propertyBeginValue: string | number,
  target: number,
  easing: Function,
  time: number,
  start: number
};