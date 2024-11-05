import { Children, createContext, useContext, useState } from "react";
import Nav from "./Nav";
import Home from "./Home";
import Collection from "./Collection";
import Detail from "./Detail";

export const themeContext = createContext(null);
const uiContext = createContext(null);
export const currentUserContext = createContext(null);
export const animeContext = createContext(null);

export default function App(){
  const [theme, setTheme] = useState('light');
  const [nextID, setNextID] = useState(1); // User id
  const [user, setUser] = useState([{id: 0, username: 'htoohtoo', email: 'akar@gmail.com', password: 'haha'}]);
  const [currentUser, setCurrentUser] = useState('htoohtoo'); // Change this later
  const [currentID, setCurrentID] = useState(0); // Change this later
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showDetail, setShowDetail] = useState(null);
  
  let animeList = [{aid: 1, title: 'Re:zero', genre: 'Psychologi, Drama, Supernatrul', img: './Rezero.jpg', score: '9/10', description: 'The story of a immortal Depression Boy who will save everyone he love in another world, however he is not overpowered like other another world mc. So we see how he scrafice and save the people he love with his time loop power'},
                   {aid: 2, title: 'Attack On Titan', genre: 'Thriller, Drama, Mystery', img: './AOT.jpg', score: '9.4/10', description: 'They fight the big nude monster.'},
                   {aid: 3, title: 'Haikyuu', genre: 'Sport, Comedy, Shonen', img: './Haikyuu.jpg',score: '8/10',  description: 'They play volleyball.'}];
  // ];
  const [anime, setAnime] = useState(animeList);

  const [collection, setCollection] = useState([{uid: 0, animeID: [1]}]);

  const root = document.documentElement;
  if(theme === 'dark'){
    root.classList.add("theme-dark");
    root.classList.remove("theme-light");
  }else{
    root.classList.add("theme-light");
    root.classList.remove("theme-dark");
  }

  const textChg = () => {
    if(showNav){
      return 'Close';
    }else{
      if(currentUser){
        return 'Logout';
      }else{
        return 'Login / Signup';
      }
    }
  }
  

  return(
    <themeContext.Provider value={{theme, setTheme, nextID, setNextID}}>

      <currentUserContext.Provider value={{currentUser, setCurrentUser, currentID, setCurrentID, user, setUser}}>

        <uiContext.Provider value={{showSignUp, setShowSignUp, showLogin, setShowLogin}}>

          <animeContext.Provider value={{anime, collection, setCollection, showDetail, setShowDetail, setShowHome}}>

            <div className={"container-" + theme}>
              <div className="sub-Container">
                <div className={"pre-NavBar-" + theme}>
                  <div className="navBar"> 
                    <Button onClick={() => {
                      setTheme(theme === 'light' ? 'dark' : 'light');
                    }}>
                      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                    </Button>
                    
                    <Button onClick={() => setShowNav(!showNav)}>{textChg()}</Button>
                  </div>
                  {showNav ? <Form/> : null}
                  <div className={`nav-Main-${theme}`}>
                    <Nav onClick={() => {setShowHome(true), setShowDetail(null)}}>Home</Nav>
                    {currentUser ? <><hr className={`hr-${theme}`}/><Nav onClick={() => {setShowHome(false), setShowDetail(null)}}>Collections</Nav></> : null}
                  </div>
                </div>
                <div className="Main">
                  <div className={`page-Main-${theme}`}>
                    {showDetail ? <Detail/> : showHome ? <Home/> : <Collection/>}
                  </div>
                </div>
              </div>
            </div>

          </animeContext.Provider>
          
        </uiContext.Provider>
        
      </currentUserContext.Provider>

    </themeContext.Provider>
  );
}

function Form(){
  const {setShowSignUp, setShowLogin} = useContext(uiContext);
  return(
    <Panel title='Welcome'>
      <Button onClick={() => setShowSignUp(true)}>Sign up</Button>   
      <Button onClick={() => setShowLogin(true)}>Log in</Button>     
    </Panel>
  );
}

function Panel({title, children}){
  const {theme, nextID, setNextID} = useContext(themeContext);
  const {showSignUp, setShowSignUp, showLogin, setShowLogin} = useContext(uiContext);
  const {collection, setCollection, setShowHome, setShowDetail} = useContext(animeContext);
  const {currentUser, setCurrentUser, currentID, setCurrentID, user, setUser} = useContext(currentUserContext);
  const className = 'panel-' + theme;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [comfirmPassword, setComfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const signUp = () => {
    if(username !== '' && email !== '' && password !== '' && comfirmPassword !== ''){
      const samePassword = user.filter((value) => value.password === comfirmPassword);
      if(password !== comfirmPassword){
        setError(<span>Passwords must be matched</span>);
      }else if(samePassword.length > 0){
        setError(<span>The Password is already used</span>);
      }else{
        const copyUser = [...user, {id: nextID,username: username, email: email, password: comfirmPassword}];
        setUser(copyUser);
        const newCollector = {uid: nextID, animeID: []};
        setCollection([...collection, newCollector]);
        setNextID(c => c + 1);
        setError(null);
      }
    }else{
      setError(<span>Fill the all field</span>);
    }
  }

  const logIn = () => {
    const loginUser = user.filter((value) => 
      (value.username === loginUsername || value.email === loginUsername) && value.password === loginPassword);
    if(loginUser.length > 0){
      setCurrentUser(loginUser[0].username);
      setCurrentID(loginUser[0].id);
      setShowLogin(false);
      setShowHome(true);
      setShowDetail(false);
    }else{
      console.log('Something went Wrong');
    }
  }

  const logOut = () => {
    setCurrentUser(null);
    setCurrentID(null);
    setShowDetail(false);
    setShowHome(true);
  }

  return(
    <section className={className}>
      {!showSignUp && !showLogin && !currentUser && <h2>{title}</h2>}
      {currentUser && <h2>{title} {currentUser} id: {currentID}</h2>}
      {showSignUp && <>
                      <div className="input-Area">
                        <Input value={username} onChange={(e) => setUsername(e.target.value)}>Username</Input>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)}>Email</Input>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)}>Password</Input>
                        <Input value={comfirmPassword} onChange={(e) => setComfirmPassword(e.target.value)}>Comfirm Password</Input>
                      </div>
                      <Button onClick={signUp}>Sign Up</Button>
                      <Button onClick={() => setShowSignUp(false)}>Back</Button>
                      {error}
                    </>}
      {showLogin && <>
                      <div className="input-Area">
                        <Input value={loginUsername} onChange={(e) => setLoginUsername(e.target.value)}>Username</Input>
                        <Input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}>Password</Input>
                      </div>
                      <Button onClick={logIn}>Log In</Button>
                      <Button onClick={() => setShowLogin(false)}>Back</Button>
                    </>}
      {!showSignUp && !showLogin && !currentUser && children}
      {currentUser && <Button onClick={logOut}>Logout</Button>}
    </section>
  );
}

function Input({children, value, onChange}){
  const {theme} = useContext(themeContext);
  const className = 'input-' + theme;
  return(
    <div className={className}>
      <span>{children}</span>
      <input type="text" value={value} onChange={onChange}/>
    </div>
  );
}

export function Button({children, onClick, isAdded}){
  const {theme} = useContext(themeContext);
  let className = null;
  if(isAdded){
    className = 'btn-Added';
  }else{
    className = 'btn-' + theme;
  }
  
  return(
    <button className={className} onClick={onClick}>{children}</button>
  );
}
