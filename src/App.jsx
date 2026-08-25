import { useEffect, useState } from 'react';
import './App.css'
import Gallery from './Gallery'
import { BrowserRouter, Routes, Route, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import DisplayListing from './DisplayListing';
import { IoCallOutline, IoLogoInstagram, IoLogoLinkedin, IoLogoTiktok, IoMailOutline, IoMenu } from 'react-icons/io5';
import Home from './Home';

function App() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayListing, setDisplayListing] = useState();

  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  /** 
   * Gets category enum from supabase as an array
  */
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
  }, [searchParams]);

  /**
   * replace the spaces in category with underscore for search params
   * @param {string} c - any string
  */
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
        <div style={{display:"flex", flexDirection:"column", gap:"0.5rem"}}>
          <small>Contact</small>
          <small style={{display:"flex", gap:"0.3rem"}}><IoMailOutline /> joeybezner@gmail.com</small>
          <small style={{display:"flex", gap:"0.3rem"}}><IoCallOutline /> {'+1 (503)-502-3569'}</small>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:"0.5rem"}}>
          <small>Socials</small>
          <div style={{display:"flex", gap:"1rem"}}>
            <IoLogoInstagram className="social" onClick={() => {window.open('https://www.instagram.com/joeybezner/?hl=en', '_blank', 'noopener,noreferrer');}} />
            <IoLogoLinkedin className="social" onClick={() => {window.open('https://www.linkedin.com/in/joeybezner/', '_blank', 'noopener,noreferrer');}} />
            <IoLogoTiktok className="social" onClick={() => {window.open('https://www.tiktok.com/@joeysart', '_blank', 'noopener,noreferrer');}} />
          </div>
        </div>
      </footer>
    </div>    
  )
}

export default App
