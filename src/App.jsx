import { useEffect, useState } from 'react';
import './App.css'
import Gallery from './Gallery'
import { BrowserRouter, Routes, Route, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import DisplayListing from './DisplayListing';
import { IoCallOutline, IoLogoInstagram, IoLogoLinkedin, IoLogoTiktok, IoMailOutline, IoMenu } from 'react-icons/io5';
import Home from './Home';
import CategoryHeader from './CategoryHeader';
import Videos from './Videos';
import CommissionForm from './CommissionForm';
import DevPage from './DevTools/DevPage';
import Login from './DevTools/Login';

function App() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayListing, setDisplayListing] = useState();

  const [categories, setCategories] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  const [session, setSession] = useState();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setSession(user);
    }
    getUser();
  }, []);
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
        {/* <div onClick={() => changePage("")}><p className="link" style={{cursor:"pointer", width:"fit-content"}}>Home</p></div> */}
        <div className='link-container desktop'>
          <Link to='/' className="link" style={{fontWeight:"550", fontSize:"1.4rem", marginRight:"1rem"}}>Joey Bezner</Link>
          <Link to='/Shop' className="link" style={{marginRight:"5rem"}}>Shop</Link>
        </div>
        <div className='link-container mobile'>
          <div onClick={() => changePage("")}><p className="link" style={{cursor:"pointer", width:"fit-content", fontWeight:"550", fontSize:"1.4rem"}}>Joey Bezner</p></div>
          <div style={{textAlign:"right", display:"flex", justifyContent:"right", alignItems:"center", gap:"1rem"}}>
            <div onClick={() => changePage("Shop")} style={{justifyItems:"center"}}><p className="link" style={{cursor:"pointer", width:"fit-content"}}>Shop</p></div>
            <IoMenu style={{cursor:"pointer"}} onClick={() => {setOpenMenu(!openMenu)}} />
          </div>
        </div>
        <div className="link-container desktop right">
          <div className='link-container desktop right'>
            <Link to='/Realism' className="link">Realism</Link>
            <Link to='/Cover_Art' className="link">Cover Art</Link>
            <Link to='/Digital' className="link">Digital</Link>
            <Link to='/Clothing' className="link">Clothing</Link>
            <Link to='/Paintings' className="link">Paintings</Link>
            <Link to='/Videos' className="link">Videos</Link>
          </div>
          {/* <div className='link-container right'>
            <IoLogoInstagram className="social" onClick={() => {window.open('https://www.instagram.com/joeybezner/?hl=en', '_blank', 'noopener,noreferrer');}} />
            <IoLogoLinkedin className="social" onClick={() => {window.open('https://www.linkedin.com/in/joeybezner/', '_blank', 'noopener,noreferrer');}} />
            <IoLogoTiktok className="social" onClick={() => {window.open('https://www.tiktok.com/@joeysart', '_blank', 'noopener,noreferrer');}} />
          </div> */}
        </div>
      </nav>
      <div className={`hamburger ${openMenu ? "" : "hide"}`}>
        {
          categories.map((category, key) => (
            <div onClick={() => {changePage(`${category}`)}} key={key} className="link">{category}</div>
          ))
        }
        <div onClick={() => {changePage('Videos')}} className="link">Videos</div>
      </div>
      <br />
      <Routes>
        <Route path='/' element={displayListing ? <DisplayListing id={displayListing} /> : <div><Home /><Gallery category={null} /></div>} />
        <Route path='/Realism' element={displayListing ? <DisplayListing id={displayListing} /> : <Gallery category="Realism" />} />
        <Route path='/Cover_Art' element={displayListing ? <DisplayListing id={displayListing} /> : <Gallery category="Cover Art" />} />
        <Route path='/Digital' element={displayListing ? <DisplayListing id={displayListing} /> : <Gallery category="Digital" />} />
        <Route path='/Clothing' element={displayListing ? <DisplayListing id={displayListing} /> : <Gallery category="Clothing" />} />
        <Route path='/Paintings' element={displayListing ? <DisplayListing id={displayListing} /> : <Gallery category="Paintings" />} />
        <Route path='/Videos' element={<Videos />} />
        <Route path='/Shop' element={displayListing ? <DisplayListing id={displayListing} /> : <CommissionForm />} />

        <Route path='/login' element={<Login session={session}/>} />
      </Routes>
      <footer>
        <div style={{display:"flex", flexDirection:"column", gap:"0.5rem"}}>
          <small>Contact</small>
          <small style={{display:"flex", gap:"0.3rem"}}><IoMailOutline /> contact@joeybezner.com</small>
          <small style={{display:"flex", gap:"0.3rem"}}><IoCallOutline /> {'+1 (503)-502-3569'}</small>
          <small style={{textDecoration:"underline"}}><Link to='/login' className="link">Login</Link></small>
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
