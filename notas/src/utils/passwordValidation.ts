export interface PasswordStrength {
  isStrong: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordStrength {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('A senha deve ter no mínimo 6 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  return {
    isStrong: errors.length === 0,
    errors
  };
} 