const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const dbName = 'phonebook'
const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]
const url = `mongodb+srv://iikka:${password}@nodeexpressprojects.16jub.mongodb.net/${dbName}?retryWrites=true&w=majority`


mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})

const Person = mongoose.model('Person', personSchema)

// create new Person
if (newName && newNumber) {
    const newPerson = new Person({
        name: newName,
        number: newNumber
    })
    newPerson.save().then(result => {
        console.log(`added ${newName}, number: ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
    // fetch all Persons
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}