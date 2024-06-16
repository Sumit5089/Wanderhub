const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Listing = require("./models/listings.js");


main()
.then(() => console.log("connection sucssefull"))
.catch((err) => console.log(err))

async function main() { 
    await mongoose.connect("mongodb://localhost:27017/newapp");
}

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname,"public")))


app.get("/", async(req,res) =>{
    const newlisting = new Listing({
        title:"sumit",
        description:"hii sumit",
        image:"jsbfbaljszbdlk",
        price:"1200",
        loctaion: "pune",
        country: "india",
    });

    await newlisting.save()
    .then((res) => console.log("listing is saved", res))
    res.send("saved")

});

app.listen(port, () => console.log(`app is runnig at port ${port}`))