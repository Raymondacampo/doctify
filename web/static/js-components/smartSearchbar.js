const { useEffect, useRef } = React;
import { valueSearch } from "../js-functions/postSearchVal"

const SmartBar = ({onAction, index}) => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = useRef(null);
  const [model, setModel] = React.useState(null)
  // Fetch data when query changes
  useEffect(() => {
    if (query) {
      // Replace with your actual API endpoint
      fetch(`smart/${query}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data); // Assuming the API returns an array of { key, value } objects
          setIsDropdownOpen(true);
        })
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle item click
  const handleItemClick = (item) => {
    if(item.model == 'Doctor'){
      window.location.href = `${item.id}/profile`;
    }

    if(!index){
      valueSearch(item.name, item.model.toLowerCase(), onAction, item.model)
      setQuery('')
    }
    else{
      valueSearch(item.name, item.model.toLowerCase(), setQuery)
    }
    
    setTimeout(() => {setIsDropdownOpen(false)}, 150);
  };

  return (
    <div className="smart_bar" ref={dropdownRef}>
      <div className="input-container">
        <input type="text" placeholder="Search..." value={query} className={isDropdownOpen ? 'focused' : null} onClick={() => query && setIsDropdownOpen(true)} onChange={(e) => setQuery(e.target.value)}/>
        <span className="forget-icon">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        </span>        
      </div>

      {isDropdownOpen && (
        results.length > 0 ? 
        <ul>
          {results.map((item, index) => (
            <li key={index} className={item.model} onClick={() => handleItemClick(item)}>
              <span>{item.name}</span> <span style={{fontSize: '12px', color: 'gray'}}>{item.model}</span>
            </li>
          ))}
        </ul>
      :
      <ul><li>No results</li></ul>    
    )}

    </div>
  );
};

export default SmartBar;