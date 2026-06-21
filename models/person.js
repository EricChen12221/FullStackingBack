const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, {family: 4})
        .then((response) => {
            console.log('Connection succeeded')})
        .catch((error) => {
            console.log('Connection failed')})

const personSchema = mongoose.Schema(
  {
    name: String,
    number: String
  }
)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)