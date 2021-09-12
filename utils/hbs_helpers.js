const dayjs = require('dayjs')

// Helper functions for Handlebars

module.exports = {

// formats a Date-value according to the Parameters set in the Handlebar

  formatDate: function (date, format) {
    return dayjs(date).format(format)
  },

// shows edit symbol to a single post if it belongs to the user

  editPost: function (postUser, loggedUser, postId) {
    if (postUser._id.toString() == loggedUser._id.toString()) {
        return `<a href="/posts/edit/${postId}"><i class="fas fa-pen" aria-label="Edit post"></i></a>`
    } else {
      return ''
    }
  },

// fixes status from 'public' to 'draft' and vice versa, when editing the post or else it will show the default

  fixStatus: function (status) {
    if(status === 'public'){
      return `
      <option value="public" selected>Public</option>
      <option value="draft">Draft</option>
      `
    } else {
      return `
      <option value="public">Public</option>
      <option value="draft" selected>Draft</option>
      `
    }
  }
}