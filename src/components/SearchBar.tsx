import { Search } from 'lucide-react';
import { Input } from './ui';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
        <Search className="h-5 w-5 text-luxury-accent opacity-70" />
      </div>
      <Input
        type="text"
        placeholder="Search designers by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="!pl-12 !pr-4"
      />
    </div>
  );
}
