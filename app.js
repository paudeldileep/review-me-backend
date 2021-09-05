const express = require('express')
const app = express()
const cors=require('cors');
const port = process.env.PORT || 4000;

const connectDB=require('./config/db')

//connect database
connectDB();

//Init Middleware
app.use(cors())
app.use(express.json({
    extended: false
}))

//Define routes
app.use('/api/user',require('./routes/api/user'))
app.use('/api/auth',require('./routes/api/auth'))



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})