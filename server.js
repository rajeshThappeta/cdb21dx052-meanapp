//create exp app
const exp = require("express")
const app = exp()
const path = require("path")

const userApp = require("./APIS/userApi")
require("dotenv").config()

const mongoose = require("mongoose")



//connect angular build with web server
app.use(exp.static(path.join(__dirname, './dist/mean-app')))


const dataBaseConnectionUrl = process.env.DATABASE_URL

//connect to database
mongoose.connect(dataBaseConnectionUrl)
    .then(() => console.log("connected to db"))
    .catch(err => console.log("err in db connect", err))



app.use("/user", userApp)


// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/mean-app/index.html'));
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Web server listening on port ${PORT}`))