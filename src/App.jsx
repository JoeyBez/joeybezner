import { useEffect, useState } from 'react';
import './App.css'
import Gallery from './Gallery'
import { BrowserRouter, Routes, Route, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import DisplayListing from './DisplayListing';
import { IoLogoInstagram, IoLogoLinkedin, IoLogoTiktok, IoMenu } from 'react-icons/io5';
import Home from './Home';

function App() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayListing, setDisplayListing] = useState();

  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

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
    setDisplayListing(searchParams.get('listing'));
    // console.log(searchParams.get('listing'));
  }, [searchParams]);

  const formatCategory = (c) => {
    return c.replace(' ', '_');
  }

  const changePage = (dest) => {
    navigate(`/${formatCategory(dest)}`);
    setOpenMenu(false);
  }

  return (
    <div style={{marginTop:"5rem"}}>
      <nav>
        <div onClick={() => changePage("")}><h1 style={{cursor:"pointer"}}>Joey Bezner</h1></div>
        <div className='link-container desktop'>
          {
            categories.map((category, key) => (
              <Link to={`/${formatCategory(category)}`} key={key} className="link">{category}</Link>
            ))
          }
        </div>
        <div className='link-container mobile'>
          <IoMenu onClick={() => {setOpenMenu(!openMenu)}} style={{cursor:"pointer"}}/>
        </div>
        <div className='link-container right'>
          <IoLogoInstagram className="social" onClick={() => {window.open('https://www.instagram.com/joeybezner/?hl=en', '_blank', 'noopener,noreferrer');}} />
          <IoLogoLinkedin className="social" onClick={() => {window.open('https://www.linkedin.com/in/joeybezner/', '_blank', 'noopener,noreferrer');}} />
          <IoLogoTiktok className="social" onClick={() => {window.open('https://www.tiktok.com/@joeysart', '_blank', 'noopener,noreferrer');}} />
        </div>
      </nav>
      <div className={`hamburger ${openMenu ? "" : "hide"}`}>
        {
          categories.map((category, key) => (
            <div onClick={() => {changePage(`${category}`)}} key={key} className="link">{category}</div>
          ))
        }
      </div>
      <br />
      <Routes>
        <Route path='/' element={displayListing ? <DisplayListing id={displayListing} /> : <div><Home /><Gallery category={null} /></div>} />
        {
          categories.map((category, key) => (
              <Route path={`/${formatCategory(category)}`} element={displayListing ? <DisplayListing id={displayListing} /> : <Gallery category={category} />} key={key} />
          ))
        }
      </Routes>
      <footer>
        <small>Joey Bezner</small>
        <div>
          <IoLogoInstagram className="social" onClick={() => {window.open('https://www.instagram.com/joeybezner/?hl=en', '_blank', 'noopener,noreferrer');}} />
          <IoLogoLinkedin className="social" onClick={() => {window.open('https://www.linkedin.com/in/joeybezner/', '_blank', 'noopener,noreferrer');}} />
          <IoLogoTiktok className="social" onClick={() => {window.open('https://www.tiktok.com/@joeysart', '_blank', 'noopener,noreferrer');}} />
        </div>
      </footer>
    </div>    
  )
}

export default App
