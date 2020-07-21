const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { raw } = require('express')


const app = express()

// Define paths for Express connfig
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res) => {
    res.render('index', {
        title:'Weather',
        name:'Rohan Kumar'
    })
})

app.get('/about',(req,res) => {
    res.render('about',{
        title:'About me',
        name:'Rohan Kumar'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
        helpText:'This is some helpful text',
        title:'Help',
        name:'Rohan Kumar'
    })
})


app.get('/weather', ( req,res) => {
    if(!req.query.address){
        return res.send({error: 'You must provide an address'})
    }
    // address = req.query.address
    geocode(req.query.address, (error, { latitude,longitude,location} = {}) => {
        if(error){
            return res.send({error:error})
        }
        forecast(latitude,longitude, (error,forecastData) => {
            if(error){
                return res.send({error:error})
            }
            return res.send({
                forecast:forecastData,
                location:location,
                address:req.query.address                
            })           
        })
    })
})

app.get('/products',(req,res) => {
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term'
        })
    }
    
    
    console.log(req.query.search)
    res.send({
        products:[]
    })

} )



app.get('/help/*',(req, res) =>{
    res.render('404_page',{
        title:'My 404 page',
        name:'Rohan Kumar',
        error_message:'Help article not found'
    })
}
)


app.get('*', (req, res) =>{
    res.render('404_page',{
        title:'My 404 page',
        name:'Rohan Kumar',
        error_message:'Page not found'
    })
}
)

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})