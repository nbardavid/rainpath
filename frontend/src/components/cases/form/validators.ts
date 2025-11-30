type ValidatorFn = ({ value }: { value: string }) => string | undefined

export const requiredValidator = (label: string): ValidatorFn => ({ value }) =>
  value.trim() ? undefined : `${label} est obligatoire.`

export const buildRequiredValidators = (label: string) => ({
  onBlur: requiredValidator(label),
  onChange: requiredValidator(label),
})
