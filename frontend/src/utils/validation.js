// Form validation utilities matching backend requirements

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password) => {
    // 8-16 characters, at least one uppercase letter and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    return passwordRegex.test(password);
  };
  
  export const validateName = (name) => {
    return name && name.length >= 20 && name.length <= 60;
  };
  
  export const validateAddress = (address) => {
    return !address || address.length <= 400;
  };
  
  // Validation error messages
  export const VALIDATION_MESSAGES = {
    email: {
      required: 'Email is required',
      invalid: 'Please enter a valid email address'
    },
    password: {
      required: 'Password is required',
      invalid: 'Password must be 8-16 characters with at least one uppercase letter and one special character'
    },
    name: {
      required: 'Name is required',
      invalid: 'Name must be between 20 and 60 characters'
    },
    address: {
      invalid: 'Address must not exceed 400 characters'
    }
  };
  