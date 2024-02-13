import { useState, useEffect } from 'react'
import noteService from './services/notes'
import loginService from './services/login'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer';
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [errorMessage, setErrorMessage]= useState(null)
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const addNote = (noteObject) => {
    noteService.create(noteObject).then(returnedNote => setNotes(notes.concat(returnedNote)))
  }

  const noteForm = () => {
    return (
      <Togglable buttonLabel="new note">
        <NoteForm createNote={addNote} />
      </Togglable>
    )
  }

  const handleLogin = async (userLoginObject) => {
    try {
      const user = await loginService.login(userLoginObject)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
      setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm loginUser={handleLogin} />
      </Togglable>
    )
  }

  useEffect(() => {
    noteService
    .getAll() .then(initialNotes=>{
    setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])


  const toggleImportanceOf = (id) => {
    const note = notes.find(note => note.id===id)
    const changedNote = {...note, important: !note.important}
    noteService.update(id, changedNote).then(returnedNote => {
    setNotes(notes.map(n=>n.id !== id ? n : returnedNote))
    })
    .catch(()=>{
        setErrorMessage(`Note ${note.content} was already removed from server`)
        setTimeout(() => {
        setErrorMessage(null)
        }, 5000)
    setNotes(notes.filter(n=>n.id !== id))
    })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null && loginForm()}
      {user !== null && <div>
      <p>{user.name} is logged in</p>
        {noteForm()}
      </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)} />
        )}
      </ul>
      <Footer />
    </div>
  )
}

export default App
