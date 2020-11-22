export interface NumberOfExitsResult {
  /** Threshold for transitioning from the large result to the small one. */
  breakpoint: number

  /** Number of exits for small rooms (area < breakpoint, in square feet) */
  small: number

  /** Number of exits for large rooms (area >= breakpoint, in square feet) */
  large: number
}

export type ExitLocation = 'left' | 'opposite' | 'right' | 'same'
