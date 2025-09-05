// Form validation utilities
export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  }
  
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
  }
  
  export const validateField = (
    value: any,
    rules: ValidationRule,
    fieldName: string
  ): ValidationResult => {
    const errors: string[] = [];
  
    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(`${fieldName} is required`);
    }
  
    // Skip other validations if value is empty and not required
    if (!value && !rules.required) {
      return { isValid: true, errors: [] };
    }
  
    // Min length validation
    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }
  
    // Max length validation
    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      errors.push(`${fieldName} must be no more than ${rules.maxLength} characters`);
    }
  
    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      errors.push(`${fieldName} format is invalid`);
    }
  
    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value);
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else if (!customResult) {
        errors.push(`${fieldName} is invalid`);
      }
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  export const validateForm = (
    data: Record<string, any>,
    rules: Record<string, ValidationRule>
  ): ValidationResult => {
    const allErrors: string[] = [];
    let isValid = true;
  
    Object.keys(rules).forEach((fieldName) => {
      const fieldRules = rules[fieldName];
      const fieldValue = data[fieldName];
      const validation = validateField(fieldValue, fieldRules, fieldName);
  
      if (!validation.isValid) {
        isValid = false;
        allErrors.push(...validation.errors);
      }
    });
  
    return {
      isValid,
      errors: allErrors,
    };
  };
  
  // Common validation rules
  export const VALIDATION_RULES = {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    },
    username: {
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    title: {
      required: true,
      minLength: 1,
      maxLength: 100,
    },
    content: {
      required: true,
      minLength: 1,
      maxLength: 1000,
    },
  } as const;
  
  // Specific validation functions
  export const validateEmail = (email: string): ValidationResult => {
    return validateField(email, VALIDATION_RULES.email, 'Email');
  };
  
  export const validatePassword = (password: string): ValidationResult => {
    return validateField(password, VALIDATION_RULES.password, 'Password');
  };
  
  export const validateUsername = (username: string): ValidationResult => {
    return validateField(username, VALIDATION_RULES.username, 'Username');
  };
  
  export const validateTitle = (title: string): ValidationResult => {
    return validateField(title, VALIDATION_RULES.title, 'Title');
  };
  
  export const validateContent = (content: string): ValidationResult => {
    return validateField(content, VALIDATION_RULES.content, 'Content');
  };
  
  // File validation
  export const validateFile = (
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      maxSizeMB?: number;
    } = {}
  ): ValidationResult => {
    const errors: string[] = [];
    const { maxSize, allowedTypes, maxSizeMB } = options;
  
    if (maxSize && file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize} bytes`);
    }
  
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }
  
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  