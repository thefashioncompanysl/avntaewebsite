import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Designer, DesignerCategory } from '../types';
import AnimatedSection from './AnimatedSection';
import { Reveal } from './ui';
import DesignerCard from './DesignerCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import { useDesigners } from '../context/DesignersContext';

export default function Designers() {
  const { activeDesigners, loading } = useDesigners();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DesignerCategory | 'All'>('All');

  const filteredDesigners = useMemo(() => {
    return activeDesigners.filter((designer) => {
      const matchesSearch = designer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || designer.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activeDesigners, searchQuery, selectedCategory]);

  return (
    <AnimatedSection id="designers" className="py-32 bg-transparent px-6 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14">
          <Reveal delay={0.4} width="100%">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif md:leading-tight">Exceptional <br />Designers</h2>
          </Reveal>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-16 items-start lg:items-center justify-between">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        {loading ? (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-serif">Loading designers...</p>
          </div>
        ) : filteredDesigners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredDesigners.map((designer, index) => (
              <DesignerCard key={designer.id} designer={designer} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <p className="text-xl font-serif">No designers found matching your criteria.</p>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
