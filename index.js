require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const errorHandler = require('./middleware/errorHandler')

morgan.token('data', (req) => {
    if (req.method === 'POST')
        return JSON.stringify(req.body)
    else
        return
})
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())


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
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
    const newPersonData = {
        name: request.body.name,
        number: request.body.number
    }

    const newPerson = new Person(newPersonData)
    newPerson.save()
        .then(result => {
            return response.json(result).status(200)
        })
        .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
    const personData = {
        name: request.body.name,
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id, personData, { new: true, runValidators: true })
        .then(person => {
            response.json(person).status(200)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            return response.status(204)
        })
        .catch(() => {
            return response.status(500)
        })
})

app.get('/info', (request, response) => {
    Person.count({})
        .then(result => {
            response.send(
                `<p>Phonebook has info for ${result} people.</p>
                <p>${new Date(Date.now())}</p>`
            )
        })
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})