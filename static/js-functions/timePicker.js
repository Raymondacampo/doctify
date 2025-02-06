const { useRef, useEffect } = React;

/**
 * Custom hook that invokes `callback` if a click happens outside the `ref` element.
 */
function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * Generate an array of 15-minute increments in 24-hour format:
 * ["00:00","00:15","00:30","00:45","01:00","01:15",...,"23:45"]
 */
function generateHourlyItems() {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    [0, 15, 30, 45].forEach((minute) => {
      const hh = String(hour).padStart(2, "0");
      const mm = String(minute).padStart(2, "0");
      times.push(`${hh}:${mm}`); // raw "HH:MM"
    });
  }
  return times;
}

/**
 * Convert a "HH:MM" string into a 12-hour label, e.g. "13:15" -> "1:15 pm"
 */
function formatHourlyLabel(rawTime) {
  const [hourStr, minuteStr] = rawTime.split(":");
  let hour = parseInt(hourStr, 10);
  let minute = parseInt(minuteStr, 10);

  const suffix = hour < 12 ? "am" : "pm";
  let displayHour = hour % 12;
  if (displayHour === 0) {
    displayHour = 12; // midnight/noon edge-case
  }

  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

/**
 * Generate an array for the "minute" type: [15, 30, 45, 60].
 * We'll store them as strings for consistency ("15", "30", "45", "60").
 */
function generateMinuteItems() {
  return [15, 30, 45, 60].map((num) => String(num));
}

/**
 * Convert the raw minute string to a user-friendly label:
 * "15" -> "15 minutes", "60" -> "1 hour"
 */
function formatMinuteLabel(rawValue) {
  const num = parseInt(rawValue, 10);
  if (num === 60) return "1 hour";
  return `${num} minutes`;
}

/**
 * Single component that, based on the `type` prop:
 * - If type="hour", shows times from "00:00" to "23:45" in 15-min increments
 * - If type="minute", shows ["15","30","45","60"]
 * - Closes dropdown when clicking outside
 */
function TimePicker({ name, type = "hour", onAction }) {
  const [selectedValue, setSelectedValue] = React.useState("");
  const [showList, setShowList] = React.useState(false);

  const containerRef = useRef(null);
  useOutsideClick(containerRef, () => {
    if (showList) {
      setShowList(false);
    }
  });

  // Decide which array (and which formatter) based on `type`
  let itemsArray = [];
  let formatLabel = () => "";

  if (type === "hour") {
    itemsArray = generateHourlyItems(); // e.g. ["00:00","00:15",...,"23:45"]
    formatLabel = formatHourlyLabel;    // "13:15" -> "1:15 pm"
  } else if (type === "minute") {
    itemsArray = generateMinuteItems(); // e.g. ["15","30","45","60"]
    formatLabel = formatMinuteLabel;    // "60" -> "1 hour"
  }

  // Handle user choosing an item
  const handleClickItem = (raw) => {
    console.log(raw)
    setSelectedValue(raw);
    setShowList(false);
    onAction(raw)
  };

  // Display label in the text input
  const displayLabel = selectedValue ? formatLabel(selectedValue) : "";

  return (
    <div className="time-picker" style={type == 'hour' ? {width: '90px'} : {width: '120px'}} ref={containerRef}>
      <input type="text" readOnly placeholder={type} value={displayLabel} onClick={() => setShowList(!showList)}  style={{cursor: 'pointer'}}/>
      <input type="hidden" name={name} value={selectedValue}/>
      {/* Dropdown list */}
      {showList && (
        <ul>
          {itemsArray.map((rawValue, index) => (
            <li
              key={index}
              onClick={() => handleClickItem(rawValue)}
             
            >
              {formatLabel(rawValue)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TimePicker;
