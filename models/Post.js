const mongoose = require('mongoose')
const slugify = require('slugify')
const domPurifier = require('dompurify')
const { JSDOM } = require('jsdom')
const htmlPurify = domPurifier(new JSDOM().window)
const { stripHtml} = require('string-strip-html')

// Mongoose Post-Schema with various constraints/qualifiers. 

const PostSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        trim: true
    },
    body: {
        type: String, 
        maxLength: 50000,
        required: true
    },
    status: {
        type: String, 
        default: 'public',
        enum: ['public', 'draft']
    },
    slug: {
        type: String,
        required: true,
        unique: true
      },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }, 
    preview: {
        type: String,
    }
    }, 
    { timestamps: true } 
    )

// pre('validate') middleware sanitizes the post body's html, strips html tags from post preview, turns title into a slug
// before it is saved to the database

PostSchema.pre('validate', function(next) {
    if (this.body) {
        this.body = htmlPurify.sanitize(this.body)
        this.preview = stripHtml(this.body.substring(0, 400)).result.concat('...')
    }
    if (this.title) {
        this.slug = slugify(this.title, { lower: true, strict: true, locale: 'de' })
    }

    next()
})

module.exports = mongoose.model('Post', PostSchema)