import React from 'react';
import axios from 'axios'

import StudentTable  from './pages/StudentTable';
axios.defaults.baseURL = 'https://reportcard-wze0.onrender.com';
function App() {
    return(
        <div>
        <StudentTable/>
        </div>
    )
}

export default App;
