const {useEffect} = React;
const {useRef} = React;
import Equis from "../js-components/equis";
import UserIcon from "../js-components/userIcon";
import { UserLinkList, DoctorLinkList, UserHeader, DoctorHeader } from "../js-components/profileListComponents";
const App = () => {
    let [show, setShow] = React.useState(false)
    let [close, setClose] = React.useState(false)
    let [user, setUser] = React.useState({
        is_doctor: null,
        username: null
    })
    let reference = useRef()

    useEffect(() => {
        getUser();
        handler();

        function handler(){
            if(window.innerWidth <= 900){
                setClose(true); 
            } else {
                setClose(false); 
            };
            return ()=> removeEventListener('resize', handler)
        }

        async function getUser() {
            const u = await fetch('/myaccount/user_info').then(response => response.json())
            setUser({
                is_doctor: u[1],
                username: u[0]
            })
        }

        window.addEventListener('resize', handler);

    }, [])

    useEffect(() => {
        let handleClick = (e) => {
            if (!reference.current.contains(e.target)){
                setShow(false)
            }
        }
        if(show){
            document.addEventListener('mousedown', handleClick)      
        }
         
        
        if (show && window.innerWidth <= 900){
            document.body.style.overflow = 'hidden';
        }else{
            document.body.style.overflow = '';
        }  

        return() => {
            document.removeEventListener('mousedown', handleClick)
        }   

    },[show])

    return(
        <div className='child'>
            {!close && (user.is_doctor == false ? <UserHeader/> : <DoctorHeader/>)}

            <button onClick={() => setShow(!show)} className={show ? 'selected' : undefined}><UserIcon/> <span>{user.username}</span></button>
            {show && (
                <div ref={reference} className={show ? 'profile_list_div' : undefined}>
                    <div className='contents'>
                        {close &&(
                        <div className='close_nav'>
                            <div className='profile_icon'>
                            <UserIcon/> 
                            <span>{user.first_name}</span>
                            </div>
                            
                            <Equis onAction={setShow} setFalse={true}/>
                        </div>                             
                        )}
                        {close &&(<hr></hr>)}
                        {user.is_doctor == false ? <UserLinkList/> : <DoctorLinkList/>}
                    </div>
                </div>
            )}
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById('profile_list'))
root.render(<App/>)