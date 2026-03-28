import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2, Football } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: ReactNode;
    fullWidth?: boolean;
}

export function Button({
                           variant = 'primary',
                           size = 'md',
                           loading = false,
                           icon,
                           fullWidth = false,
                           children,
                           className = '',
                           disabled,
                           ...props
                       }: ButtonProps) {
    const base = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:shadow-xl focus:ring-emerald-500',
        secondary: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 hover:from-slate-300 hover:shadow-md focus:ring-slate-400 dark:from-slate-700 dark:to-slate-800 dark:text-white',
        outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500/10 focus:ring-emerald-400 dark:border-emerald-400 dark:text-emerald-400',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 focus:ring-red-500 shadow-lg',
        ghost: 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm h-10',
        md: 'px-6 py-3 text-base h-12',
        lg: 'px-8 py-4 text-lg h-16',
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {icon && <span className="mr-2">{icon}</span>}
            {children}
            {!loading && !icon && <Football className="ml-2 h-4 w-4 opacity-80" />}
        </button>
    );
}