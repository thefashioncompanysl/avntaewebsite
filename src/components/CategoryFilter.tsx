import { DesignerCategory } from '../types';
import { Button } from './ui';

interface CategoryFilterProps {
  selected: DesignerCategory | 'All';
  onChange: (category: DesignerCategory | 'All') => void;
}

const categories: (DesignerCategory | 'All')[] = ['All', 'Student', 'Intern', 'Professional'];

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? 'default' : 'outline'}
          size="md"
          onClick={() => onChange(cat)}
          className={`rounded-full px-5 py-2.5 text-[10px] ${selected === cat ? 'shadow-[0_0_15px_rgba(255,255,255,0.15)] scale-[1.02]' : 'opacity-70 hover:opacity-100'}`}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
