"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import Button from './Button';
import { useAppContext } from '@/context/AppContext';
import { useSound } from '@/hooks/useSound';
import { SOUNDS } from '@/lib/sounds';

// Zod Schema for validation
const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC = () => {
  const { setKakuEmotion } = useAppContext();
  const { playSound } = useSound();
  const [formStatus, setFormStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors, isSubmitting, touchedFields } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setFormStatus('submitting');
    setKakuEmotion('excited'); // Kaku gets excited on submit attempt
    console.log("Form Data:", data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success/error
    const success = Math.random() > 0.2; // 80% success rate
    if (success) {
      setFormStatus('success');
      setKakuEmotion('happy');
      playSound(SOUNDS.SUBMIT);
      // Trigger transition in parent via callback prop if needed
    } else {
      setFormStatus('error');
      setKakuEmotion('thoughtful'); // Kaku thoughtful on error
    }
  };

  // Kaku reaction based on interaction
  React.useEffect(() => {
    if (Object.keys(touchedFields).length > 0 && formStatus === 'idle') {
      setKakuEmotion('curious');
    }
  }, [touchedFields, setKakuEmotion, formStatus]);

  return (
    <motion.div
      className="w-full max-w-md p-8 bg-cosmic-black/50 backdrop-blur-sm rounded-xl border border-stellar-white/20 shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {formStatus === 'success' ? (
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <svg className="w-16 h-16 mx-auto text-kaku-encouraging" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </motion.div>
          <h3 className="text-2xl font-bold mt-4 text-kaku-encouraging">Success!</h3>
          <p className="text-stellar-white mt-2">Our journey begins! Preparing the transition...</p>
          {/* Trigger actual transition here */}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-2xl font-bold text-center text-stellar-white mb-6">Begin Our Journey Together</h3>

          {formStatus === 'error' && (
            <p className="text-nebula-pink text-center bg-nebula-pink/10 p-2 rounded">
              Something went wrong. Please try again!
            </p>
          )}

          {/* Input Field Wrapper */}
          <div className="relative">
            <label htmlFor="name" className="block text-sm font-medium text-stellar-white/80 mb-1">
              Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 bg-cosmic-black/30 border ${
                errors.name ? 'border-nebula-pink' : 'border-stellar-white/30'
              } rounded-md text-stellar-white focus:outline-none focus:ring-2 focus:ring-cosmic-teal focus:border-transparent transition`}
              placeholder="What should I call you?"
              onFocus={() => setKakuEmotion('curious')}
            />
            {errors.name && (
              <p className="text-nebula-pink text-xs mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-stellar-white/80 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-2 bg-cosmic-black/30 border ${
                errors.email ? 'border-nebula-pink' : 'border-stellar-white/30'
              } rounded-md text-stellar-white focus:outline-none focus:ring-2 focus:ring-cosmic-teal focus:border-transparent transition`}
              placeholder="Your cosmic connection point"
              required
              onFocus={() => setKakuEmotion('curious')}
            />
            {errors.email && (
              <p className="text-nebula-pink text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-stellar-white/80 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-2 bg-cosmic-black/30 border ${
                errors.password ? 'border-nebula-pink' : 'border-stellar-white/30'
              } rounded-md text-stellar-white focus:outline-none focus:ring-2 focus:ring-cosmic-teal focus:border-transparent transition`}
              placeholder="Secret passage (min 8 chars)"
              required
              onFocus={() => setKakuEmotion('curious')}
            />
            {errors.password && (
              <p className="text-nebula-pink text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || formStatus === 'submitting'} 
            className="w-full"
          >
            {formStatus === 'submitting' ? 'Connecting...' : 'Begin Our Journey'}
          </Button>

          <p className="text-xs text-stellar-white/50 text-center mt-4">
            Your information stays in our galaxy. See our privacy policy.
          </p>
        </form>
      )}
    </motion.div>
  );
};

export default SignUpForm; 