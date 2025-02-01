const InPersonIcon = () => {
    return (
        <svg className="in_person_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="rgb(127, 127, 127)">
            <path d="M12 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 11c-5.33 0-8 2.67-8 5v3h16v-3c0-2.33-2.67-5-8-5z"/>
        </svg>
    )
}
const VirtualIcon = () => {
    return(
        <svg className="camera_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="black">
            <path d="M5 5c-1.66 0-3 1.34-3 3v8c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3v-1l3.6 2.4c.6.4 1.4 0 1.4-.8v-8c0-.8-.8-1.2-1.4-.8L18 9V8c0-1.66-1.34-3-3-3H5z"/>
        </svg>        
    )
}

const DateSisIcon = () => {
    return(
        <svg className="sistem" role="img" aria-hidden="true" width="20" height="16" viewBox="0 0 15 20" fill="none" data-test="insurance-in-network-badge">
            <path d="M7.5.833 0 4.167v5c0 4.625 3.2 8.95 7.5 10 4.3-1.05 7.5-5.375 7.5-10v-5L7.5.833ZM5.833 14.167 2.5 10.833l1.175-1.175 2.158 2.15 5.492-5.491L12.5 7.5l-6.667 6.667Z" fill="#039854"></path>
        </svg>
    )
}

const LocationIcon = () => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="20" fill="#101079">
            <path d="M12 2c-3.86 0-7 3.14-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
    )
}

export {VirtualIcon, InPersonIcon, DateSisIcon, LocationIcon}