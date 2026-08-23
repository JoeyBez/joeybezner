import { useEffect, useState } from 'react';
import './App.css'
import Gallery from './Gallery'
import { BrowserRouter, Routes, Route, Link, useSearchParams } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import DisplayListing from './DisplayListing';
import { IoLogoInstagram, IoLogoLinkedin, IoLogoTiktok, IoMailOutline } from 'react-icons/io5';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayListing, setDisplayListing] = useState();

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

  useEffect(() => {
    setDisplayListing(searchParams.get('listing'));
    // console.log(searchParams.get('listing'));
  }, [searchParams]);

  const formatCategory = (c) => {
    return c.replace(' ', '_');
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
        <div className='link-container right'>
          <IoLogoInstagram className="social" onClick={() => {window.open('https://www.instagram.com/joeybezner/?hl=en', '_blank', 'noopener,noreferrer');}} />
          <IoLogoLinkedin className="social" onClick={() => {window.open('https://www.linkedin.com/in/joeybezner/', '_blank', 'noopener,noreferrer');}} />
          <IoLogoTiktok className="social" onClick={() => {window.open('https://www.tiktok.com/@joeysart', '_blank', 'noopener,noreferrer');}} />
        </div>
      </nav>
      <br />
      <Routes>
        <Route path='/' element={<div>Home!</div>} />
        {
          categories.map((category, key) => (
              <Route path={`/${formatCategory(category)}`} element={displayListing ? <DisplayListing id={displayListing} /> : <Gallery category={category} />} key={key} />
          ))
        }
      </Routes>
    </div>    
  )
}

export default App
