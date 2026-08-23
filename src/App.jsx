import { useEffect, useState } from 'react';
import './App.css'
import Gallery from './Gallery'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

function App() {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    const { data, error } = await supabase
      .rpc('get_categories')

    if (error) {
      console.error('Error running SQL:', error.message)
      return
    }

    setCategories(data);
  }

  useEffect(() => {
    getCategories();
  }, [])

  const formatCategory = (c) => {
    return c.replace(' ', '_');
  }

  const deformatCategory = (c) => {
    return c.replace('_', ' ');
  }

  return (
    <div>
      <nav>
        <h1>Joey Bezner</h1>
        <div className='link-container'>
          {
            categories.map((category, key) => (
              <Link to={`/${formatCategory(category)}`} key={key} className="link">{category}</Link>
            ))
          }
        </div>
      </nav>
      <br />
      <Routes>
        <Route path='/' element={<div>Home!</div>} />
        {
          categories.map((category, key) => (
            <Route path={`/${formatCategory(category)}`} element={<Gallery category={category} />} key={key} />
          ))
        }
      </Routes>
    </div>    
  )
}

export default App
