import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pr-10 pl-4 py-2 border border-border bg-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-48 sm:w-64"
      />
    </div>
  );
};

export default SearchInput;