const express = require('express')
const app = express()
const cors=require('cors');
const path = require('path')
const port = process.env.PORT || 4000;

const connectDB=require('./config/db')

//connect database
connectDB();

//Init Middleware
app.use(cors())
app.use(express.json({
    extended: false
}))


app.use(express.static(path.join(__dirname, 'public')))

//Define routes
app.use('/api/user',require('./routes/api/user'))
app.use('/api/auth',require('./routes/api/auth'))
app.use('/api/product',require('./routes/api/product'))



app.listen(port, () => {
  console.log(`Review-me server listening at http://localhost:${port}`)
})