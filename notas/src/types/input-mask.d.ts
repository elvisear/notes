declare module 'react-input-mask' {
  import { ComponentType, InputHTMLAttributes } from 'react'

  export interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
    mask: string
    maskChar?: string | null
    formatChars?: { [key: string]: string }
    alwaysShowMask?: boolean
    beforeMaskedStateChange?: (state: any) => any
    children?: (inputProps: InputHTMLAttributes<HTMLInputElement>) => JSX.Element
  }

  const InputMask: ComponentType<InputMaskProps>
  export default InputMask
} 