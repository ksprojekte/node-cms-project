const Post = require('../models/Post')
const User = require('../models/User')

// Handlers for routes/posts.js

module.exports = {

  // Displays the latest 21 posts published by all users
  // for route GET '/'

    posts: (async (req, res) => {
        try {
          const posts = await Post.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .limit(21)
            .lean()
      
          res.render('posts/index', {
            posts,
          })
        } catch (err) {
          console.error(err)
          res.render('errors/500')
        }
      }),

// Displays the create new post page
// for route GET '/new'

    newPostPage: ((req, res) => {
        res.render('posts/new')
      }),

// Creates a new post instance and saves it to the database
// for route POST '/'

    createPost: (async (req, res) => {
        try {
          req.body.user = req.user.id
          const post = new Post(req.body)
          await post.save(req.body)
          res.redirect('/dashboard')
        } catch (err) {
          console.error(err)
          res.render('errors/500')
        }
      }),

// Displays a particular post, but not a draft, unless it belongs to the user
// for route GET '/:slug'

    post: (async (req, res) => {
      try {
        let post = await Post.findOne({ slug: req.params.slug }).populate('user').lean()

        if (!post) {
          return res.render('errors/404')
        } else if (post.user._id != req.user.id && post.status == 'draft') {
          res.render('errors/private') 
         } else {
          res.render('posts/view', {
            post,
          })
        }
      } catch (err) {
        console.error(err)
        res.render('errors/500')
      }
    }),

// Displays the edit page, if the post belongs to the user, else it redirects to noedit page
// for route GET '/edit/:id'

    editPage: (async (req, res) => {
      try {
        const post = await Post.findOne({
          _id: req.params.id,
        }).lean()
    
      if (post.user != req.user.id) {
          res.render('errors/noedit')
        } else {
          res.render('posts/edit', {
            post,
          })
        }
      } catch (err) {
        console.error(err)
        return res.render('errors/500')
      }
    }),

// Updates post in the database and redirects to updated post
// for route POST '/:id'

    updatePost: (async (req, res) => {
      try {
      let post = await Post.findById(req.params.id)
      for(const[key,value] of Object.entries(req.body)){
          post[key]=req.body[key]
        }
        await post.save()
        res.redirect(`/posts/${post.slug}`)
      } catch (err) {
        console.error(err)
        return res.render('errors/500')
      }
    }),

// Deletes a post if it belongs to the user, else redirects to noedit page.
// for route DELETE '/:id'

    deletePost: (async (req, res) => {
      try {
        let post = await Post.findById(req.params.id).lean()
    
        if (post.user != req.user.id) {
          res.redirect('errors/noedit')
        } else {
          await Post.deleteOne({ _id: req.params.id })
          res.redirect('/dashboard')
        }
      } catch (err) {
        console.error(err)
        return res.render('errors/500')
      }
    }),

// Displays a user's published posts 
// for route GET '/user/:userId'

    userPosts: (async (req, res) => {
      try {
        const posts = await Post.find({
          user: req.params.userId,
          status: 'public',
        })
          .populate('user')
          .sort({ createdAt: 'desc' })
          .lean()
    
// Gets the User's name for their page, even if they haven't posted anything
        const user = await User.findOne({ _id: req.params.userId }).populate('user').lean()
    
        res.render('posts/user', {
          posts,
          user
        })
      } catch (err) {
        console.error(err)
        res.render('errors/404')
      }
    })
  

}