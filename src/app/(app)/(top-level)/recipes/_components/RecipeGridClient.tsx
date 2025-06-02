'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Recipe } from '@/lib/dummy-recipes';
import RecipeCard from './RecipeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, Star, ChefHat, Zap, Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface RecipeGridClientProps {
  allRecipes: Recipe[];
}

const CATEGORY_ALL = 'All';
const CATEGORY_FAVORITES = 'Favorites';

export default function RecipeGridClient({ allRecipes }: RecipeGridClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { favoriteRecipeIds } = useFavorites();

  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORY_ALL);

  useEffect(() => {
    setCurrentSearchTerm(searchParams.get('search') || '');
    setActiveCategory(searchParams.get('category') || CATEGORY_ALL);
  }, [searchParams]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setCurrentSearchTerm(term);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== CATEGORY_ALL) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    allRecipes.forEach(recipe => recipe.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).slice(0, 4);
  }, [allRecipes]);

  const categories = [CATEGORY_ALL, ...uniqueTags, CATEGORY_FAVORITES];

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case CATEGORY_ALL.toLowerCase(): return <ListFilter size={18} />;
      case CATEGORY_FAVORITES.toLowerCase(): return <Heart size={18} />;
      case 'dessert': return <ChefHat size={18} />;
      case 'quick meal':
      case 'healthy':
      case 'appetizer': return <Zap size={18} />;
      default: return <Star size={18} />;
    }
  };

  const filteredRecipes = useMemo(() => {
    let recipes = allRecipes;

    if (activeCategory === CATEGORY_FAVORITES) {
      recipes = recipes.filter(recipe => favoriteRecipeIds.includes(recipe.id));
    } else if (activeCategory !== CATEGORY_ALL) {
      recipes = recipes.filter(recipe => recipe.tags?.includes(activeCategory));
    }

    if (currentSearchTerm) {
      const lowerSearchTerm = currentSearchTerm.toLowerCase();
      recipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(lowerSearchTerm) ||
        recipe.description.toLowerCase().includes(lowerSearchTerm) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
      );
    }
    return recipes;
  }, [allRecipes, currentSearchTerm, activeCategory, favoriteRecipeIds]);

  return (
    <div className="space-y-6 py-4">
      <div className="sticky top-0 z-20 bg-background/95 py-4 backdrop-blur-lg md:px-0">
        <div className="container mx-auto flex w-full max-w-2xl items-center space-x-2 rounded-full border bg-card p-2 shadow-lg">
          <Search className="ml-2 h-5 w-5 flex-shrink-0 text-gray-400" />
          <Input
            type="search"
            placeholder="Search recipes (e.g., chicken, dessert, quick)"
            value={currentSearchTerm}
            onChange={handleSearchChange}
            className="flex-grow border-none bg-transparent text-base placeholder-gray-500 focus:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <div className="mt-4 flex justify-center">
          <div className="no-scrollbar -mx-4 flex space-x-1 overflow-x-auto px-4 pb-2 sm:px-0">
            {categories.map(category => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(category)}
                className={`h-auto flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ease-in-out hover:shadow-md 
                            ${activeCategory === category ? 'bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-accent'}`}
              >
                <span className="mr-2">{getCategoryIcon(category)}</span>
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="container mx-auto grid grid-cols-1 gap-x-4 gap-y-8 px-4 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="container mx-auto flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-semibold text-gray-700">No Recipes Found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filters.
          </p>
          {(currentSearchTerm || activeCategory !== CATEGORY_ALL) && (
            <Button variant="link" onClick={() => { handleSearchChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>); handleCategoryChange(CATEGORY_ALL);}} className="mt-4">
              Clear search & filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 