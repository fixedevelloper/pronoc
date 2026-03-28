import { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'search' | 'price';
    fullWidth?: boolean;
    iconLeft?: React.ReactNode;
}

export function Input({
                          variant = 'default',
                          fullWidth = false,
                          iconLeft,
                          className = '',
                          ...props
                      }: InputProps) {
    const base = 'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 shadow-sm';

    const variants = {
        default: 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-400 bg-white/50 backdrop-blur-sm',
        search: 'pl-12 pr-4 border-emerald-200 hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-400',
        price: 'text-right font-mono text-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-400',
    };

    return (
        <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
            {iconLeft && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {iconLeft}
                </div>
            )}
            <input
                className={`${base} ${variants[variant]} ${className}`}
                {...props}
            />
        </div>
    );
}