const{ useEffect, useRef } = React;

const SearchBar = ({ fetchUrl, onSelect }) => {
  const [options, setOptions] = React.useState([]); // Full list of options
  const [filteredOptions, setFilteredOptions] = React.useState([]); // Filtered options based on input
  const [searchTerm, setSearchTerm] = React.useState(""); // Current search term
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false); // Show/hide dropdown

  const searchBarRef = useRef(null); // Create a ref for the entire search bar container

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false); // Close the dropdown if clicking outside
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Fetch the list of options from the server when the component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("Failed to fetch options");
        const data = await response.json();
        setOptions(data); // Store the full list
        setFilteredOptions(data); // Initialize the filtered list
        console.log(data)
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [fetchUrl]);

  // Handle input changes in the search bar
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter options based on the input
    if (value === "") {
      setFilteredOptions(options); // Reset to full list if input is cleared
    } else {
      setFilteredOptions(
        options.filter((option) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  // Handle clicking an option
  const handleOptionClick = (option) => {
    setSearchTerm(option.name); // Set the selected option in the search bar
    setIsDropdownVisible(false); // Hide the dropdown
    if (onSelect) onSelect([option.id, option.type, option.name]); // Pass the selected option to the parent
  };

  return (
    <div ref={searchBarRef} style={{ position: "relative", width: '100%'}}>
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={() => setIsDropdownVisible(true)} // Show dropdown on focus
        placeholder="Search..."
        style={{
          width: "96%",
          padding: "12px 8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Dropdown Options */}
      {isDropdownVisible && (
        <div
          style={{
            position: "absolute",
            width: '100%',
            top: "42px",
            left: "0",
            right: "0",
            maxHeight: "300px",
            overflowY: "auto",
            background: "#fff",
            borderRadius: "4px",
            zIndex: 1000,
            boxShadow: '1px 1px 5px #00000042',
            animationName: 'display_list',
            animationDuration: '1s'
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: "1.5rem 0.5rem",
                  cursor: "pointer",
                  borderBottom: '1px solid #8080801f'
                }}
                onMouseDown={(e) => e.preventDefault()} // Prevent losing focus on click
              >
                {option.name}
              </div>
            ))
          ) : (
            <div style={{ padding: "8px", color: "#888" }}>No matches found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
