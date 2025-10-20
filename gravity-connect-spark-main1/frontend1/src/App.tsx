import { useEffect, useState } from 'react'


import App1 from './project1/App1';
import App2 from './project2/App2';

function App() 
{
  const [active, setActive] = useState(2);

  return active === 1 ? <App1 /> : <App2 />;
}

export default App
