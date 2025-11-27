import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import TrashDisplay2 from './TrashDisplay2.jsx'
import SummaryPage from './SummaryPage.jsx'
import WelcomePage2 from './WelcomePage2.jsx'
import TrashTrigger3 from './components/TrashTrigger3.jsx'
import "./trash_main.module.css"

function Main() {
 return (
   <HashRouter> 
       <Routes>
        <Route path="/" element={<WelcomePage2/>} />
         <Route path="/mainpage" element={
            <TrashTrigger3>
            <TrashDisplay2/>
            </TrashTrigger3>
            }/>
         <Route path="/summary" element={<SummaryPage/>} />
       </Routes>
   </HashRouter>
 );
}

createRoot(document.getElementById('root')).render(
    <Main />
);
