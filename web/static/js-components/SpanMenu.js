import Equis from "./equis";
import csrftoken from "../js-functions/cookie";
// If using .jsx, just rename to SpanMenu.jsx. Either way is fine if your bundler is set up.
const { useEffect, useRef } = React;

export default function SpanMenu({ itemId, spanElement }) {
    const [showMenu, setShowMenu] = React.useState(false);

    const [showPopup, setShowPopup] = React.useState(false);
    const [popupMode, setPopupMode] = React.useState(null); // "edit" or "delete"
    const [popupData, setPopupData] = React.useState(null);

    const menuRef = useRef(null);
    const popupRef = useRef(null);
    const weekdays = ['Monday','Tueday','Wednesday','Thursday','Friday','Saturday','Sunday']
    /**
     * Attach a click listener to the actual DOM span
     */
    useEffect(() => {
        if (!spanElement) return;

        function handleSpanClick(e) {
        e.stopPropagation();
        setShowMenu(true);
        setShowPopup(false);
        }

        spanElement.addEventListener("click", handleSpanClick);
        return () => {
        spanElement.removeEventListener("click", handleSpanClick);
        };
    }, [spanElement]);

    /**
     * Outside click: close menu/popup if user clicks outside them
     */
    useEffect(() => {
        function handleOutsideClick(e) {
        if (showMenu && menuRef.current && !menuRef.current.contains(e.target)) {
            setShowMenu(false);
        }
        if (showPopup && popupRef.current && !popupRef.current.contains(e.target)) {
            setShowPopup(false);
        }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [showMenu, showPopup]);


    async function handleDeleteClick() {
        setShowMenu(false);
        setPopupMode("delete");
        setShowPopup(false);
        setPopupData(null);

        try {
        const data = await fetch(`manage_my_schedule/${itemId}`).then(response => response.json());
        console.log(data)
        setPopupData(data);
        } catch (err) {
        setPopupData({ error: String(err) });
        }
        setShowPopup(true);
    }

    function deleteDate(){
        fetch(`manage_my_schedule/${itemId}?delete=True`, {
            method: 'post', 
            headers: {'X-CSRFToken': csrftoken},
        }).then(response => response.json()).then(location.reload())
    }


    // Render the floating menu and the popup
    return (
        <>
        {showMenu && (
            <div
            ref={menuRef}
            style={{
                position: "absolute",
                right: '0px',
                top: '-20px',
                background: "#fff",
                border: "1px solid #ccc",
                padding: "6px 8px",
                borderRadius: "4px",
                zIndex: 9999,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                display: 'flex',
                flexDirection: 'column',
                fontSize: '14px',
                animationName: 'display_manage',
                animationDuration: '0.5s'
            }}
            >
            <button onClick={handleDeleteClick} style={{ color: "red" }}>
                Delete
            </button>
            </div>
        )}

        {showPopup && (
            <div ref={popupRef} className="manage_body">
                <div className="manage_container" style={{maxHeight: '250px', maxWidth: '95%'}}>
                    {popupMode === "delete" && (
                        <>
                            <Equis onAction={setShowPopup}/>
                            <div className="manage_content" style={{height: '100%'}}>
                            <h4>Delete date?</h4>
                            {popupData ? (
                                <>
                                    {popupData.modalidad == 'virtually' ? 
                                    <span className="date-scheduled" style={{maxWidth: '90%'}}>Virtual date on {popupData.days.map((d, index) => <> {weekdays[d]} </>)}</span> 
                                    :<span className="date-scheduled" style={{maxWidth: '90%'}}>Date in {popupData.clinica.name} on {popupData.days.map((d) => <> {weekdays[d]} </>)}</span>  }                       
                                </>
                                
                            ) : (
                                <p>Loading delete data...</p>
                            )}
                            <button className="delete_btn" style={{marginTop: 'auto'}} onClick={() => deleteDate()}>Confirm Delete</button>
                            </div>                        
                        </>

                    )}                
                </div>
            </div>
        )}
        </>
    );
}
