import Equis from "./equis";
import csrftoken from "../js-functions/cookie";
import CustomAlert from "./customAlert";
const {useRef,useEffect} = React;
const Rating = () => {
    const [hoveredIndex, setHoveredIndex] = React.useState(null); // Tracks the hovered button index
    const [selectedIndex, setSelectedIndex] = React.useState(-1); // Tracks the clicked (selected) button index
    const [showReviewBox, setShowReviewBox] = React.useState(false); // Tracks whether to show the review box
    const [missing, setMissing] = React.useState({
        star: null,
        headline: null,
        review: null
    })
    const headRef = useRef();
    const bodyRef = useRef();

    const docName = document.getElementById('doc-name').innerHTML

    const [alertData, setAlertData] = React.useState(null);   

    useEffect(() => {
        // Check for alertData in localStorage
        const storedData = localStorage.getItem("alertData");
    
        if (storedData) {
          const parsedData = JSON.parse(storedData); // Parse the stored JSON string
          setAlertData(parsedData); // Set the alert data in state
          localStorage.removeItem("alertData"); // Clear the data to prevent reuse
        }

        setTimeout(() => {
            setAlertData(null); // Clear the alert data
          }, 5000);
        
      }, []);


    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    const handleClick = (index) => {
        setSelectedIndex(index);
    };

    const createReview = () => {
        if (selectedIndex < 0){
            setMissing({
                star: 'Please choose a rating'
            })
        }else{
            fetch(`create_review`, {
                method: 'POST',
                headers: {
                    'X-CSRFTOKEN': csrftoken,
                },
                body: JSON.stringify({ rate: selectedIndex, headline: headRef.current.value, review: bodyRef.current.value }),
              }).then(response => response.json()).then(data => {
                const alertData = {
                    showAlert: true,
                    alertType: data.success,
                    alertMessage: data.message,
                  };
                
                  // Save the object in localStorage as a string
                  localStorage.setItem("alertData", JSON.stringify(alertData));
                  window.location.reload(); 
              })

                       
        }

    };
    

    return (
        <div className="rating-with-review">
        {alertData && (
            <CustomAlert
            valid={alertData.alertType}
            message={alertData.alertMessage}
            />
        )}
        {/* Rating Stars */}


        {/* Review Box */}
        {showReviewBox ? (
            <div className="review-box-container">
                <div className="review-box">
                    <Equis onAction={setShowReviewBox}/>
                    <h2>Create a Review with {docName}</h2>
                    <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <button
                            key={index}
                            className={`fr-star ${
                            index <= (hoveredIndex ?? selectedIndex) ? "active" : "empty"
                            }`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(index)}
                        >
                            ★
                        </button>
                        ))}
                        {missing.star && <span className="missing">{missing.star}</span>}
                    </div>
                    <h3>Write your headline here</h3>
                    <textarea ref={headRef} className="review-input" placeholder="Whats more important to know..."rows="1"></textarea>
                    <h3>Write your review here</h3>
                    <textarea ref={bodyRef} className="review-input r" placeholder="Write your review here..."rows="4"></textarea>
                    <button className="submit-button" onClick={() => createReview()}>Submit</button>
                </div>
            </div>
        )
        :
        <button className="make-review-button" onClick={() => setShowReviewBox(true)}>Leave a review</button>}
        </div>
    );
};

export default Rating;
