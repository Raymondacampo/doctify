const Equis = ({onAction, setFalse}) => {
    return(
        <div className="change" onClick={() => setFalse ? onAction(false) : onAction()}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
        </div> 
    )
}
export default Equis;