const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()

app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use(express.urlencoded({ extended: true }))

const url = `mongodb+srv://glebClusterUser:glebClusterUserPassword@cluster0.fvfru.mongodb.net/cms?retryWrites=true&w=majority`;

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const SiteSchema = new mongoose.Schema({
    name: String,
    password: String,
    prefixDB: String,
    company: String
}, { collection : 'mysites' })

const SiteModel = mongoose.model('SiteModel', SiteSchema)

app.get('/api/sites/create', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    let query = SiteModel.find({  })
    query.exec((err, allSites) => {
        if (err) {
            return res.json({ "status": "Error" })
        }
        
        let siteExists = false

        allSites.forEach(site => {
            if(site.name.includes(req.query.sitename)){
                siteExists = true
            }
        })
        if(siteExists){
            return res.json({ status: 'Error' })
        } else {
            let encodedPassword = "#"
            const salt = bcrypt.genSalt(saltRounds)
            encodedPassword = bcrypt.hashSync(req.query.password, saltRounds)
            const site = new SiteModel({ name: req.query.sitename, password: encodedPassword, company: req.query.sitecompany, prefixDB: req.query.dbprefix })
            site.save(function (err) {
                if (err) {
                    return res.json({ "status": "Error" })
                } else {
                    let siteData = {
                        name: req.query.sitename,
                        password: req.query.password,
                        company: req.query.sitecompany,
                        dbPrefix: req.query.dbprefix,
                        items: [],
                        theme: 'light',
                        pagination: true,
                        paginationItems: 5
                    }
                    return res.json({ status: 'OK', siteData: siteData })
                }
            })
        }
    })
})


app.get('/api/sites/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    return res.sendFile(__dirname + `/sites/index.html`)

})

app.get('**', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    return res.redirect(`/?redirectroute=${req.path}`)

})

// const port = process.env.PORT || 8080
const port = 4000

app.listen(port)
