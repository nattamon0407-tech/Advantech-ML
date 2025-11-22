import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TrashDisplay from './TrashDisplay.jsx'
import SummaryPage from './SummaryPage.jsx';
import TrashTrigger2 from './components/TrashTrigger2.jsx';

function Main() {
 return (
   <BrowserRouter> 
       <Routes>
         <Route path="/" element={
            <TrashTrigger2>
            <TrashDisplay />
            </TrashTrigger2>
            } />
         <Route path="/summary" element={<SummaryPage />} />
       </Routes>
   </BrowserRouter>
 );
}

createRoot(document.getElementById('root')).render(
    <Main />
);
