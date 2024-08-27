// RENDER THE BUTTON 
export default function Items_button(){
    return(
        <button id='selection' name='selection' className='search_btn' type='button' > hola</button>
    )
}

// // RENDERS A LIST WITH ALL OPTIONS
// export function Items_list(data){
//     let temporaryList = data.temporaryList
//     let lista = data.lista
//     return(<div key={stat} className='option_cont' >
//                 <div className='items_txtbx'><input type='text' autoFocus onKeyUp={() => {ejecucion(event, lista)}}></input></div>
//                 <div className='option_list'>{temporaryList.map((l) => <button type='button' key={l} onClick={() => {choosedOption(l)}}className='item_btn'>{l}</button>)}</div>
//             </div>                
//     )}

// // CHANGES FROM BUTTON TO OPTION LIST
// export async function show(){
//     let list;
//     if(stat.name == 'specialities'){
//         const items_cont = await fetch('specialities').then(response => response.json())
//         list = items_cont
//         }
//         cambioBoton({
//             boton1: <Items_list lista={list} temporaryList={list}/>,
//         })
//     }

// // SETS THE BUTTON WITH A VALUE
// export function choosedOption(t){
//     currVal = t;
//     selection = t;
//     cambioBoton({
//         boton1: <Items_button val={t}/>
//     });
// }

// // MATCHES THE TYPO WITH RESULTS
// export function searching(event, dataList){
//     let list = []
//     if((event.target.value).length > 0){
//         let e = event.target.value
//         dataList.map((p) => {if(p.toLowerCase().includes(e.toLowerCase())){
//             list.push(p)}
//         })
//     cambioBoton({
//         boton1: <Items_list lista={dataList} temporaryList={list}/>
//     }) 
//     }else{
//         show()
//     }}


// function Renderizar(info){
//     return(
//         <div className='doc_search_container'>
//             {info.list.map((doc) => 
//             <div key={doc.id}>
//                 <h1 key={doc.name}>{doc.name}</h1>
//                 <h1 key={doc.speciality}>{doc.speciality}</h1>
//                 <div key='pene'>{doc.clinic.map((c) => <h1 key={c.id}>{c}</h1>)}</div>
//             </div>
//             )}
//         </div>
//     )
// }


// async function espe(){
//     const spe = await fetch('search').then(response => response.json())
//     console.log(spe)
//     return <Renderizar list={spe}/>
// }