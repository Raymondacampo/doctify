const UserLinkList = () => {
    return (
        <>
            <a href='/myaccount/configurate'>Mi cuenta</a>
            <a href='/myaccount/dates?a_page=1&u_page=1'>Mis citas</a>
            <a href='/myaccount/recent?page=1'>Doctores recientes</a>
            <a  href='/accounts/doctor_signup'>Conviertete en doctor</a>
            <hr></hr>
            <a href='/logout'>Log out</a>        
        </>
    )
}

const UserHeader = () => {
    return(
        <div style={{display:'flex', height:'100%'}}>
            <a href='/myaccount/dates?a_page=1&u_page=1'>Mis citas</a>
            <a href='/myaccount/recent?page=1'>Doctores recientes</a>                
        </div>   
    )
}

const DoctorLinkList = () => {
    return (
        <>
            <a href='/myaccount/configurate'>Mi cuenta</a>
            <a href='/myaccount/doctor_profile'>Perfil de doctor</a>
            <a href='/myaccount/dates?a_page=1&u_page=1'>Citas pendientes</a>
            <a href='/myaccount/recent?page=1'>Clientes recientes</a>
            <hr></hr>
            <a href='/logout'>Log out</a>       
        </>
    )
}

const DoctorHeader = () => {
    return(
        <div style={{display:'flex', height:'100%'}}>
            <a href='/myaccount/dates?a_page=1&u_page=1'>Citas pendientes</a>
            <a href='/myaccount/recent?page=1'>Clientes recientes</a>                
        </div>   
    )
}

export {UserLinkList, DoctorLinkList, UserHeader, DoctorHeader}