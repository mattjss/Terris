import type { Feature, MultiPolygon, Polygon } from 'geojson'

/** Stylized (not academically exact) empire extents for globe visualization. */
export interface EmpireBoundaryRecord {
  empireId: string
  yearStart: number
  yearEnd: number
  color: string
  feature: Feature<Polygon | MultiPolygon>
}

/** Very coarse polygons — for illustration only. */
export const empireBoundaries: EmpireBoundaryRecord[] = [
  {
    empireId: 'roman-empire',
    yearStart: -27,
    yearEnd: 476,
    color: '#c9a84c',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6, 36],
            [12, 37],
            [18, 42],
            [28, 41],
            [40, 43],
            [44, 37],
            [36, 32],
            [24, 31],
            [12, 33],
            [-2, 36],
            [-6, 36],
          ],
        ],
      },
    },
  },
  {
    empireId: 'byzantine-empire',
    yearStart: 330,
    yearEnd: 1453,
    color: '#9b7cb8',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 42],
            [30, 45],
            [42, 43],
            [44, 38],
            [40, 33],
            [32, 35],
            [26, 38],
            [22, 40],
            [20, 42],
          ],
        ],
      },
    },
  },
  {
    empireId: 'ottoman-empire',
    yearStart: 1299,
    yearEnd: 1922,
    color: '#c75c5c',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 48],
            [28, 50],
            [42, 44],
            [48, 40],
            [46, 34],
            [38, 31],
            [28, 36],
            [22, 42],
            [20, 48],
          ],
        ],
      },
    },
  },
  {
    empireId: 'mongol-empire',
    yearStart: 1206,
    yearEnd: 1368,
    color: '#6b9b6b',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [40, 55],
            [55, 58],
            [100, 52],
            [115, 45],
            [110, 38],
            [95, 40],
            [75, 42],
            [55, 46],
            [40, 55],
          ],
        ],
      },
    },
  },
  {
    empireId: 'persian-empire',
    yearStart: -550,
    yearEnd: -330,
    color: '#5ba8a0',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [42, 38],
            [55, 42],
            [62, 38],
            [58, 28],
            [48, 26],
            [42, 32],
            [42, 38],
          ],
        ],
      },
    },
  },
  {
    empireId: 'han-dynasty',
    yearStart: -206,
    yearEnd: 220,
    color: '#c77a4a',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [102, 35],
            [118, 40],
            [120, 32],
            [112, 22],
            [100, 24],
            [95, 30],
            [102, 35],
          ],
        ],
      },
    },
  },
  {
    empireId: 'aztec-empire',
    yearStart: 1428,
    yearEnd: 1521,
    color: '#d4843a',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-102, 18],
            [-96, 22],
            [-98, 24],
            [-104, 22],
            [-102, 18],
          ],
        ],
      },
    },
  },
  {
    empireId: 'inca-empire',
    yearStart: 1438,
    yearEnd: 1533,
    color: '#8ba84c',
    feature: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-76, -6],
            [-70, -8],
            [-72, -16],
            [-78, -14],
            [-76, -6],
          ],
        ],
      },
    },
  },
]

export function boundariesVisibleAtYear(year: number): EmpireBoundaryRecord[] {
  return empireBoundaries.filter(
    (b) => year >= b.yearStart && year <= b.yearEnd,
  )
}
