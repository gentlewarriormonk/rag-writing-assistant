'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/context/AccessibilityContext';

interface SignUpFormProps {
  onSubmit: (data: any) => void;
  initialValues?: Record<string, any>;
  isSubmitting?: boolean;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  initialValues = {},
  isSubmitting = false
}) => {
  const [values, setValues] = React.useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    password: initialValues.password || '',
    interests: initialValues.interests || []
  });
  
  const [touched, setTouched] = React.useState({
    name: false,
    email: false,
    password: false
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [currentFocus, setCurrentFocus] = React.useState<string | null>(null);
  
  const { reducedMotion } = useAccessibility();
  
  // Validate form values
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!values.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!values.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!values.password) {
      newErrors.password = 'Password is required';
    } else if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };
  
  // Handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle interests checkboxes
      const interestValue = name.replace('interest-', '');
      const newInterests = checked
        ? [...values.interests, interestValue]
        : values.interests.filter((interest: string) => interest !== interestValue);
      
      setValues({
        ...values,
        interests: newInterests
      });
    } else {
      setValues({
        ...values,
        [name]: value
      });
    }
    
    // Validate field on change if it's been touched
    if (touched[name as keyof typeof touched]) {
      const validationErrors = validate();
      setErrors({
        ...errors,
        [name]: validationErrors[name] || ''
      });
    }
    
    // Trigger Kaku's reaction (would be implemented in a real project)
    if (typeof window !== 'undefined' && (window as any).kakuReactToFormField) {
      const isValid = !validate()[name];
      (window as any).kakuReactToFormField(name, isValid);
    }
  };
  
  // Handle field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validate field on blur
    const validationErrors = validate();
    setErrors({
      ...errors,
      [name]: validationErrors[name] || ''
    });
    
    setCurrentFocus(null);
  };
  
  // Handle field focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setCurrentFocus(e.target.name);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validate();
    setErrors(validationErrors);
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true
    });
    
    // Submit if no errors
    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };
  
  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: reducedMotion ? 0.1 : 0.5,
        staggerChildren: reducedMotion ? 0 : 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: reducedMotion ? 0.1 : 0.3 }
    }
  };
  
  return (
    <motion.div
      className="sign-up-form-container w-full max-w-md mx-auto bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-6 border border-gray-700"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <motion.h2 
        className="text-2xl font-bold text-white mb-6 text-center"
        variants={itemVariants}
      >
        Join Kaku on Your Writing Journey
      </motion.h2>
      
      <form onSubmit={handleSubmit}>
        <motion.div className="mb-4" variants={itemVariants}>
          <label 
            htmlFor="name" 
            className="block text-white text-sm font-medium mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`w-full px-4 py-2 bg-gray-800 text-white rounded-md border ${
              errors.name && touched.name ? 'border-red-500' : 'border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Your name"
            disabled={isSubmitting}
          />
          {errors.name && touched.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </motion.div>
        
        <motion.div className="mb-4" variants={itemVariants}>
          <label 
            htmlFor="email" 
            className="block text-white text-sm font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`w-full px-4 py-2 bg-gray-800 text-white rounded-md border ${
              errors.email && touched.email ? 'border-red-500' : 'border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </motion.div>
        
        <motion.div className="mb-6" variants={itemVariants}>
          <label 
            htmlFor="password" 
            className="block text-white text-sm font-medium mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`w-full px-4 py-2 bg-gray-800 text-white rounded-md border ${
              errors.password && touched.password ? 'border-red-500' : 'border-gray-600'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Create a password"
            disabled={isSubmitting}
          />
          {errors.password && touched.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </motion.div>
        
        <motion.div className="mb-6" variants={itemVariants}>
          <p className="block text-white text-sm font-medium mb-2">
            What are you interested in? (Optional)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['Creative Writing', 'Journaling', 'Professional Writing', 'Poetry'].map((interest) => (
              <label 
                key={interest} 
                className="flex items-center text-white text-sm"
              >
                <input
                  type="checkbox"
                  name={`interest-${interest}`}
                  checked={values.interests.includes(interest)}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4"
                  disabled={isSubmitting}
                />
                {interest}
              </label>
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Begin Your Journey with Kaku'
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default SignUpForm;
