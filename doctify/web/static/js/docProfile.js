import DoctorCalendar from "../js-components/calendar";
import CustomAlert from "../js-components/customAlert";
import Rating from "../js-components/ratingButtons";
import ReviewsList from "../js-components/reviews";
const {useEffect} = React;
function App(){
    let [show, setShow] = React.useState()

    let [date, setDate] = React.useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth()
    })

    const [calendar, setCalendar] = React.useState()
    const [loading, setLoading] = React.useState(false)

    const [alert, setAlert] = React.useState({
        valid: null,
        msg: null
    })

    const [virtually, setVirtual] = React.useState(false)

    // Renders CALENDAR DAYS
    async function getCalendar(v){
        setLoading(true)
        try{
            const cal = await fetch(`calendar?year=${date.year}&month=${date.month}&virtually=${virtually}`).then(response => response.json())
            setCalendar(cal)
        }finally{
            setLoading(false)
        }
           
    }   

    const updateCal = (year, month) => {
        setDate({
            year: year,
            month: month
        })
    }

    useEffect(() => {
        getCalendar()
    },[date, virtually])

    useEffect(() => {
        if (alert.msg){
            setTimeout(() => {autoClose()}, 4000);
        }
        function autoClose(){
            setAlert({valid:null, msg:null})
        }
    }, [alert])


    return(
        <>
            <>
                {show && calendar && <DoctorCalendar onAction={setShow} onAlert={setAlert} cal={calendar} setDate={updateCal} y={date.year} m={date.month} loading={loading} virtually={virtually} setVirtual={setVirtual} owner={calendar.is_doc}/>}
                <button className='buttonBlue' onClick={() => setShow(true)}>Hacer cita</button>
                {alert.msg && <CustomAlert valid={alert.valid} message={alert.msg}/> }       
            </>   

        </>
    )
}

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.n_b');
  const sections = document.querySelectorAll('section');
  const STICKY_HEIGHT = 96; // Height of the sticky navigation bar
  const OFFSET = 10; // Additional offset for determining the active section
  
  // Function to update the active button based on the section closest to 10px below the sticky navbar
  function updateActiveButton() {
    let activeSection = null;
    let closestDistance = Infinity;
  
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const distanceFromStickyBottom = Math.abs(rect.top - (STICKY_HEIGHT + OFFSET));
  
      // Find the section closest to the sticky navbar's reference point
      if (distanceFromStickyBottom < closestDistance) {
        closestDistance = distanceFromStickyBottom;
        activeSection = section;
      }
    });
  
    // Update the active class on navigation buttons
    buttons.forEach(button => {
      button.classList.toggle('active', button.getAttribute('data-section') === activeSection?.id);
    });
  }
  
  // Smooth scrolling to ensure proper alignment
  buttons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const targetSection = document.getElementById(button.getAttribute('data-section'));
  
      // Scroll to align the target section's top to 10px below the sticky navbar
      window.scrollTo({
        top: targetSection.offsetTop - STICKY_HEIGHT + OFFSET,
        behavior: 'smooth',
      });
  
      // Ensure the correct button becomes active after scroll
      setTimeout(updateActiveButton, 300); // Match timeout to scroll animation duration
    });
  });
  
  // Update active button on manual scroll
  window.addEventListener('scroll', updateActiveButton);
  
  // Initial active button update
  updateActiveButton();

document.querySelectorAll('.rating').forEach(ratingElement => {
  const rating = parseFloat(ratingElement.dataset.rating); // Extract rating value
  const fullStars = Math.floor(rating); // Calculate the number of full stars
  const hasHalfStar = rating % 1 !== 0; // Determine if there's a half star

  // Generate stars
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('div');
    star.classList.add('star');

    if (i < fullStars) {
      star.classList.add('full'); // Full star
    } else if (i === fullStars && hasHalfStar) {
      star.classList.add('half'); // Half star
    } else {
      star.classList.add('empty'); // Empty star
    }

    ratingElement.appendChild(star);
  }
});

document.querySelectorAll('.fr-star').forEach(star => {
  star.addEventListener('mouseover', (event) => {
    star.className = 'fr-star active'
  })
  star.addEventListener('mouseout', (event) => {
    star.className = 'fr-star empty'
  })
})


})

if(document.getElementById('date_btn_cont')){
  const dateRoot = ReactDOM.createRoot(document.getElementById('date_btn_cont'))
  dateRoot.render(<App/>)

}

const reviewRoot = ReactDOM.createRoot(document.getElementById('make_review'))
reviewRoot.render(<Rating/>)

const reviewsRoot = ReactDOM.createRoot(document.getElementById('reviews'))
reviewsRoot.render(<ReviewsList/>)