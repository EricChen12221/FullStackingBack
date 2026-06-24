const mongoose = require('mongoose')

if(process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('missing content')
  process.exit('1')
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.k0chrxf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String
  }
)

const Person = mongoose.model('Person', personSchema)

if(process.argv.length == 5){
  const person = new Person(
    {
      name: process.argv[3],
      number: process.argv[4]
    }
  )

  person.save().then((response) =>
  {
    console.log(`Added ${response.name} ${response.number} to phonebook`)
    mongoose.connection.close()
  }
  )
} else {
  Person.find({}).then((response) =>
  {
    console.log('phonebook:')
    response.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
  }
  )
}

