/* eslint-disable no-unused-vars */
require('dotenv').config()

const fetch = require('node-fetch')
const logger = require('morgan')
const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const Prismic = require('@prismicio/client')
const PrismicH = require('@prismicio/helpers')
const UAParser = require('ua-parser-js')

const app = express()
const path = require('path')
const port = process.env.PORT || 3000

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(errorHandler())
app.use(methodOverride())
app.use(express.static(path.join(__dirname, 'public')))

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch
  })
}

// Link Resolver
const HandleLinkResolver = (doc) => {
  if (doc.type === 'project') {
    return `/detail/${doc.uid}`
  }

  if (doc.type === 'projects') {
    return '/projects'
  }

  if (doc.type === 'about') {
    return '/about'
  }

  // Default to homepage
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])
  const time = new Date()

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.Link = HandleLinkResolver
  res.locals.PrismicH = PrismicH
  res.locals.Time = (timezone) => {
    const timeLength = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: timezone }).length
    const timeShow = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: timezone })
    if (timeLength > 7) {
      return timeShow
    } else {
      return '0' + timeShow
    }
  }

  next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.locals.basedir = app.get('views')

const handleRequest = async (api) => {
  const [meta, preloader, navigation, footer, home, about, projects, { results: projectList }] =
    await Promise.all([
      api.getSingle('meta'),
      api.getSingle('preloader'),
      api.getSingle('navigation'),
      api.getSingle('footer'),
      api.getSingle('home'),
      api.getSingle('about'),
      api.getSingle('projects'),
      api.query(Prismic.predicate.at('document.type', 'project'), {
        fetchLinks: 'project.image'
      })
    ])

  const assets = []

  projectList.forEach((project) => {
    assets.push(project.data.thumbnail.url)
    project.data.body.forEach((item) => {
      if (item.slice_type === 'gallery') {
        item.items.forEach((image) => {
          assets.push(image.image.url)
        })
      }
    })
  })

  return {
    assets,
    meta,
    home,
    projects,
    projectList,
    about,
    preloader,
    navigation,
    footer
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/home', {
    ...defaults
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/about', {
    ...defaults
  })
})

app.get('/projects', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('pages/projects', {
    ...defaults
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  const project = await api.getByUID('project', req.params.uid, {
    fetchLinks: 'project.title'
  })

  res.render('pages/detail', {
    ...defaults,
    project
  })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
