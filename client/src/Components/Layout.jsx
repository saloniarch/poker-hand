import { Children } from 'react';

export function Layout({children}) {
    return(
        <div style={{ width: "100vw", height: "100vh"}}>
            <div style={{ width: "75vw", height: "100vh", margin: "auto"}}>

                <div className="app">
                    <div style={{ height: "10vh", paddingBottom: "1vh", paddingTop: "3vh", borderBottom: "1px solid black", marginBottom: "5vh"}}>    
                        <h1 style={{textAlign: "center", marginTop: 0}} >Poker Hand Game</h1>
                    </div>
                {Children.only(children)}
                </div>        
            </div>
        </div>
    )
}