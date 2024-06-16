const mongoose = require('mongoose')
const initdata = require('./data.js')
const Listings = require('../models/listings.js')


main()
.then(() => console.log("connection sucssefull"))
.catch((err) => console.log(err))

async function main() { 
    await mongoose.connect("mongodb://localhost:27017/newapp");
}

const initDB = async () => {
    await Listings.deleteMany({})
    await Listings.insertMany(initdata.data)
    console.log("data was initialized..")
}
initDB()