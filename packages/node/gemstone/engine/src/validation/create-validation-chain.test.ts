import { Validation } from 'monet'

import { createValidationChain } from './create-validation-chain'
import { Validator } from './validator'

describe('createValidationChain', () => {
  describe('if no validators provided', () => {
    const chain = createValidationChain()

    it('succeeds', () => {
      expect(chain('arbitrary-value').isSuccess()).toBe(true)
    })

    it('returns the input object', () => {
      expect(chain('arbitrary-value').success()).toBe('arbitrary-value')
    })
  })

  describe('mock tests', () => {
    const validator1 = jest.fn() as jest.MockedFunction<Validator<unknown, string, string>>
    const validator2 = jest.fn() as jest.MockedFunction<Validator<string, 'arbitrary-exact-string', string>>
    const validate = createValidationChain(validator1, validator2)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('when input is valid', () => {
      beforeEach(() => {
        validator1.mockReturnValue(Validation.Success('some-string'))
        validator2.mockReturnValue(Validation.Success('arbitrary-exact-string'))
      })

      it('returns correct result', () => {
        const result = validate('anything')
        expect(result.isSuccess()).toBe(true)
        expect(result.success()).toBe('arbitrary-exact-string')
      })

      it('correctly calls first validator', () => {
        validate('anything')
        expect(validator1).toHaveBeenCalledTimes(1)
        expect(validator1).toHaveBeenCalledWith('anything')
      })

      it('correctly calls second validator', () => {
        validate('anything')
        expect(validator2).toHaveBeenCalledTimes(1)
        expect(validator2).toHaveBeenCalledWith('some-string')
      })
    })

    describe('when first validator fails', () => {
      beforeEach(() => {
        validator1.mockReturnValue(Validation.Fail('the error message'))
      })

      it('returns correct result', () => {
        const result = validate('anything')
        expect(result.isFail()).toBe(true)
        expect(result.fail()).toBe('the error message')
      })

      it('correctly calls first validator', () => {
        validate('anything')
        expect(validator1).toHaveBeenCalledTimes(1)
        expect(validator1).toHaveBeenCalledWith('anything')
      })

      it('does not call second validator', () => {
        validate('anything')
        expect(validator2).not.toHaveBeenCalled()
      })
    })

    describe('when second validator fails', () => {
      beforeEach(() => {
        validator1.mockReturnValue(Validation.Success('some-string'))
        validator2.mockReturnValue(Validation.Fail('the error message'))
      })

      it('returns correct result', () => {
        const result = validate('anything')
        expect(result.isFail()).toBe(true)
        expect(result.fail()).toBe('the error message')
      })

      it('correctly calls first validator', () => {
        validate('anything')
        expect(validator1).toHaveBeenCalledTimes(1)
        expect(validator1).toHaveBeenCalledWith('anything')
      })

      it('correctly calls the second validator', () => {
        validate('anything')
        expect(validator2).toHaveBeenCalledTimes(1)
        expect(validator2).toHaveBeenCalledWith('some-string')
      })
    })
  })

  describe('non-mock tests with pseudo data', () => {
    type AnyRecord = Record<string, unknown>
    type Person = { name: string }
    type Employee = Person & { employeeId: string }

    const isObject: Validator<unknown, AnyRecord> = (anything) =>
      typeof anything === 'object' && anything !== null
        ? Validation.Success(anything as AnyRecord)
        : Validation.Fail('Input was not an object!')

    const isPerson: Validator<AnyRecord, Person> = (record) =>
      'name' in record
        ? Validation.Success(record as Person)
        : Validation.Fail('Input was not a Person!')

    const isEmployee: Validator<Person, Employee> = (person) =>
      'employeeId' in person
        ? Validation.Success(person as Employee)
        : Validation.Fail('Input was not an Employee!')

    const isValidEmployeeId: Validator<Employee, Employee> = (employee) => {
      const superSecretHash = `HASHED(${employee.name})`
      return employee.employeeId === superSecretHash
        ? Validation.Success(employee)
        : Validation.Fail('Employee had invalid ID.')
    }

    const validate = createValidationChain(
      isObject,
      isPerson,
      isEmployee,
      isValidEmployeeId
    )

    it('accepts valid input', () => {
      const input: unknown = {
        employeeId: 'HASHED(John Doe)',
        name: 'John Doe',
      }

      const result = validate(input)
      expect(result.isSuccess()).toBe(true)
      expect(result.success()).toBe(input)
    })

    it('rejects non-objects', () => {
      const result = validate('not an object')
      expect(result.isFail()).toBe(true)
      expect(result.fail()).toBe('Input was not an object!')
    })

    it('rejects non-Person objects', () => {
      const result = validate({ willPass: false })
      expect(result.isFail()).toBe(true)
      expect(result.fail()).toBe('Input was not a Person!')
    })

    it('rejects non-Employee objects', () => {
      const result = validate({ name: 'John Doe' })
      expect(result.isFail()).toBe(true)
      expect(result.fail()).toBe('Input was not an Employee!')
    })

    it('rejects Employees with invalid IDs', () => {
      const result = validate({ employeeId: 'invalid-id', name: 'John Doe' })
      expect(result.isFail()).toBe(true)
      expect(result.fail()).toBe('Employee had invalid ID.')
    })
  })
})
