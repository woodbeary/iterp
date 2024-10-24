declare module '@turf/turf' {
  export interface Point {
    type: 'Point'
    coordinates: [number, number]
  }

  export interface Feature<G = any> {
    type: 'Feature'
    geometry: G
    properties?: any
  }

  export function point(
    coordinates: [number, number],
    properties?: any
  ): Feature<Point>

  export function circle(
    center: Feature<Point> | [number, number],
    radius: number,
    options?: {
      steps?: number
      units?: 'miles' | 'kilometers' | 'degrees'
      properties?: any
    }
  ): Feature<any>

  export function distance(
    from: Feature<Point> | [number, number],
    to: Feature<Point> | [number, number],
    options?: {
      units?: 'miles' | 'kilometers' | 'degrees'
    }
  ): number
}
