import './App.css';
import {Route, Routes} from 'react-router';
import Homepage from './pages/Homepage'
import Rooms from './pages/Room'
import Error404 from './pages/Error'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/rooms/:id" element={<Rooms />} />
            <Route path="*" element={<Error404 />} />
        </Routes>
    )
}

export default App;
