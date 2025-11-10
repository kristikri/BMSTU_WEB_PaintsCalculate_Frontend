import './Search.css';
import searchlogo from "../../assets/search.png"
interface SearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

export default function Search({ query, onQueryChange, onSearch }: SearchProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

   return (
    <form onSubmit={handleSubmit} className="search-form">
      <input 
        type="text" 
        name="query"
        className="search-input" 
        placeholder="Введите название краски" 
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button type="submit" className="button">
        <img src={searchlogo} alt="Поиск" className="search-logo" />
      </button>
    </form>
  );
}