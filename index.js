const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('data', (req, res) => {
    if (req.method == "POST")
        return JSON.stringify(req.body)
    else
        return
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const queryId = request.params.id
    const person = persons.find(person => person.id == queryId)
    if (!person) response.sendStatus(404)
    response.json(person)
})

app.post('/api/persons', (request, response) => {
    const newPerson = {
        id: Math.floor(Math.random() * 1000000000),
        name: request.body.name,
        number: request.body.number
    }

    // The name or number is missing
    if (!(newPerson.name && newPerson.number)) {
        return response.json({ error: 'name or number missing' })
    }

    // The name already exists in the phonebook
    if (persons.some(person => person.name === newPerson.name)) {
        return response.json({ error: 'name must be unique' })
    }
    persons.push(newPerson)
    return response.json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const queryId = request.params.id
    for (let i = 0; i < persons.length; i++) {
        if (persons[i].id == queryId) {
            persons.splice(i, 1)
        }
    }
    response.send('Person deleted')
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people.</p>
        <p>${new Date(Date.now())}</p>`
    )
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})