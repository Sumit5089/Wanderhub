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
    initdata.data =  initdata.data.map((obj) => ({...obj, owner:"66755fa8b3e71af4eeefcb71"}));
    await Listings.insertMany(initdata.data)
    console.log("data was initialized..")
}
initDB()