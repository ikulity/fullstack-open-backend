require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const errorHandler = require('./middleware/errorHandler')

morgan.token('data', (req, res) => {
    if (req.method == "POST")
        return JSON.stringify(req.body)
    else
        return
})
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())

const persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// fetch all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

// fetch a single person
app.get('/api/persons/:id', (request, response) => {
    const queryId = request.params.id
    const person = persons.find(person => person.id == queryId)
    if (!person) response.sendStatus(404)
    response.json(person)
})

app.post('/api/persons', (request, response, next) => {
    const newPersonData = {
        name: request.body.name,
        number: request.body.number
    }

    // The name or number is missing
    if (!(newPersonData.name && newPersonData.number)) {
        return response.json({ error: 'name or number missing' }).status(400)
    }

    // The name already exists in the phonebook
    if (persons.some(person => person.name === newPersonData.name)) {
        return response.json({ error: 'name must be unique' }).status(400)
    }
    const newPerson = new Person(newPersonData);
    newPerson.save()
        .then(result => {
            console.log("add successful:", result)
            return response.json(newPerson).status(200)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
    const personData = {
        name: request.body.name,
        number: request.body.number
    }

    Person.findByIdAndUpdate(request.params.id, personData, { new: true })
        .then(person => {
            response.json(person).status(200)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            return response.status(204).end()
        })
        .catch(err => {
            console.log('error removing a person:', err.message)
            return response.status(500)
        })
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date(Date.now())}</p>`
    )
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})