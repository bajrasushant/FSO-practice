const notesRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response)=> {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
    const note = await Note.findById(request.params.id)
    if(note) {
      response.json(note)
    } else { response.status(404).end()
    }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if(!decodedToken.id) {
  return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if(body.content === undefined) {
    return response.status(400).json({
      error:  'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id
  })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
  if(!(username || password)) {
    response.status(401).json({error: 'username and password both required'})
  }
  
  if(!(username.length >= 3 && password.length >= 3)) {
    response.status(401).json({error: 'username and password should contain atleast 3 characters' })
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, { content,important }, { new:true, runValidators:true, context:'query' })
      response.json(updatedNote)
})


module.exports = notesRouter
