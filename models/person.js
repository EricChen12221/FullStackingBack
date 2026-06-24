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
    name: {
      type: String,
      minLength: 3
    },
    number: {
      type: String,
      minLength: 8,
      validate: (num) => {
          return /^([0-9]{2}|[0-9]{3})-[0-9]+$/.test(num)
      }
    }
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