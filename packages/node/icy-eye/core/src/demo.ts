import { Artifact, IcyEyeCore } from './types'

export const IS_EVEN = 'parity.isEvent'
export const IS_ODD = 'parity.isOdd'
export const SINGLE_DIGIT = 'singleDigit'
export const NUMBER_EXISTS = 'numberExists'

export interface NumericValue {
  value: number
}

export const ParityDiscriminatorAction = (artifact: Artifact<NumericValue>) => {
  console.log('Checking value parity:', artifact.details.value)
  if (artifact.details.value % 2 == 0) {
    artifact.recordFact(IS_EVEN)
  } else {
    artifact.recordFact(IS_ODD)
  }
}

export const SingleDigitDiscriminatorAction = (artifact: Artifact<NumericValue>) => {
  console.log('Checking if value has single digit:', artifact.details.value)
  if (artifact.details.value > -10 && artifact.details.value < 10) {
    artifact.recordFact(SINGLE_DIGIT)
  }
}

const icyEye = new IcyEyeCore()
icyEye.addListener('artifactCreated', ParityDiscriminatorAction)
icyEye.addListener('artifactCreated', SingleDigitDiscriminatorAction)

icyEye.emit('artifactCreated', {
  name: 'artifactCreated',
  artifact: new Artifact('123', 'wholeNumber', { value: 1 }),
})
