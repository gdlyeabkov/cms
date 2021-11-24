const fs = require('fs')
const bcrypt = require('bcrypt')
const saltRounds = 10

const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'sites/media')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage })

const nodemailer = require("nodemailer")

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'gdlyeabkov@gmail.com',
        pass: 'reversepassword'
    }
})

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

var collections = []

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
            
            let prefix = req.query.dbprefix
            if (prefix[prefix.length - 1] !== '_') {
                prefix = `${prefix}_`
            }
            
            let encodedPassword = "#"
            const salt = bcrypt.genSalt(saltRounds)
            encodedPassword = bcrypt.hashSync(req.query.password, saltRounds)
            const site = new SiteModel({ name: req.query.sitename, password: encodedPassword, company: req.query.sitecompany, prefixDB: prefix })
            site.save(function (err) {
                if (err) {
                    return res.json({ "status": "Error" })
                } else {
                    
                    let DBSchema = new mongoose.Schema({
                        users: [mongoose.Schema.Types.Map],
                        articles: [mongoose.Schema.Types.Map],
                    }, { collection : `${prefix}my${req.query.sitename}s` })
                    
                    let dbModelName = req.query.sitename
                    let DBModel = mongoose.model(`${dbModelName[0].toUpperCase()}${dbModelName.split('').filter((siteLetter, idx) => idx !== 0).join('')}Model`, DBSchema)
                    collections.push(DBModel)
                    new collections[collections.length - 1]().save(function (err) {
                        if(err){
                            return res.json({ status: 'Error' })
                        } else {
                            collections[collections.length - 1].update({  },
                                { $push: 
                                    { 
                                        users: [
                                            {
                                                login: 'admin',
                                                password: bcrypt.hashSync(req.query.password, saltRounds)
                                            }
                                        ]
                                        
                                    }
                            }, (err, model) => {
                            
                                
                                let siteData = {
                                    name: req.query.sitename,
                                    password: req.query.password,
                                    company: req.query.sitecompany,
                                    dbPrefix: prefix,
                                    items: [],
                                    theme: 'light',
                                    pagination: true,
                                    paginationItems: 5,
                                    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Wordpress-logo_2005.png',
                                    about: {
                                        business: req.query.business,
                                        tagline: req.query.tagline,
                                        resident: req.query.resident
                                    },
                                    dbAccessToken: collections.length - 1,
                                    feedback: {
                                        inputFieldPlaceholder: 'Введите ваш вопрос',
                                        sendlabelBtn: 'Оставить вопрос',
                                        questions: []
                                    },
                                    admin: {
                                        login: 'admin'
                                    },
                                    notifications: true,
                                    mail: true
                                }
                            
                                return res.json({ status: 'OK', siteData: siteData, dbAccessToken: collections.length - 1 })    
                            })

                        }
                    })

                }
            })
        }
    })
})

app.get('/api/sites/articles/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    collections[collections.length - 1].update({  },
    // collections[Number(req.query.dbaccesstoken)].update({  },
        { $push: 
            { 
                articles: [
                    {
                        login: 'admin',
                        title: req.query.articletitle,
                        desc: req.query.articledesc
                    }
                ]
                
            }
    }, (err, model) => {
        return res.json({ status: 'OK', dbAccessToken: Number(collections[collections.length - 1]) })
        // return res.json({ status: 'OK', dbAccessToken: Number(req.query.dbaccesstoken) })    
    })

    
})

app.get('/api/sites/users/add', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // collections[Number(req.query.dbaccesstoken)].update({  },
    collections[collections.length - 1].update({  },
        { $push: 
            { 
                users: [
                    {
                        login: req.query.userlogin,
                        password: bcrypt.hashSync(req.query.userpassword, saltRounds)
                    }
                ]
                
            }
    }, (err, model) => {
        return res.json({ status: 'OK' })    
    })
  
})

app.get('/api/sites/users/check', (req,res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    let query =  collections[collections.length - 1].findOne({}, function(err, db){
        if (err || db == undefined || db == null){
            return res.json({ status: 'Error' })
        } else {
            let possibleUsers = []
            possibleUsers = db.users.filter(user => {
                return new Map(user).get('login') === req.query.userlogin && bcrypt.compareSync(req.query.userpassword, new Map(user).get('password'))
            })
            if(possibleUsers.length >= 1) {
                return res.json({ "status": "OK" })
            } else {
                return res.json({ "status": "Error" })
            }
            
        }
    })
})

app.get('/api/sites/users/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    let query = collections[collections.length - 1].find({  }, function(err, db) {
        return res.json({ "status": "OK", 'db': db })
    })

})


app.get('/api/sites/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    return res.sendFile(__dirname + `/sites/index.html`)

})

app.post('/api/sites/media/upload', upload.single('myFile'), (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    return res.redirect('http://localhost:8080/')

})

app.get('/api/sites/media/info', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    fs.readdir(`./sites/media/`, (err, mediaFiles) => {
        if (err) {
            return res.json({
                status: 'Error'
            })
        }
        return res.json({
            status: 'OK',
            mediaFiles: mediaFiles
        })
    })

})

app.get('/api/sites/media/get', (req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    return res.sendFile(__dirname + `/sites/media/${req.query.mediafile}`)

})

app.get('/api/sites/mail', async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = collections[collections.length - 1].find({ })
    await query.exec((err, clients) => {
        if (err) {
            return res.json({ status: 'Error' })
        }
        clients[0].users.map((client) => {
            let mailOptions = {
                from: `"${'gdlyeabkov'}" <${"gdlyeabkov"}>`,
                to: `${client.login}`,
                subject: `${req.query.sitename} оповещение! ${req.query.title}`,
                html: `<h3>Вы подписаны на оповещения ${req.query.sitename}. Посетите наш сайт, чтобы посмотреть новинки.</h3><br/><p>${req.query.title}.</p>`,
            }
            transporter.sendMail(mailOptions, function (err, info) {
            })
        })
        
    })
    return res.json({ status: 'OK' })
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
