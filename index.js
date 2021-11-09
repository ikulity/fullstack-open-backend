const express = require('express')
const app = express()

app.use(express.json())

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
    persons.push(newPerson)
    response.json(newPerson)
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})