import { Link, LinkProps } from 'react-router-dom';
import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  as?: ElementType;
  className?: string;
  to?: LinkProps['to'];
}

type ButtonElementProps = ComponentPropsWithoutRef<'button'>;
type LinkElementProps = Omit<ComponentPropsWithoutRef<'a'>, 'href'>;

type ButtonCombinedProps = ButtonProps & 
  (ButtonElementProps | LinkElementProps);

const Button = ({ 
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  to,
  ...props
}: ButtonCombinedProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
  };
  
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to || Component === Link) {
    return (
      <Link 
        className={classes} 
        to={to || '#'} 
        {...(props as LinkElementProps)}
      >
        {children}
      </Link>
    );
  }

  return (
    <Component 
      className={classes} 
      {...(props as ButtonElementProps)}
    >
      {children}
    </Component>
  );
};

export default Button;