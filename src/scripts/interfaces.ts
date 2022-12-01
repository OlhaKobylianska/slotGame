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
  propertyBeginValue: iReals[],
  target: number,
  easing : Function,
  time: number,
  change: Function | null,
  complete: Function | null,
  start: number ,
};