// jQuery functions for the frontend

$(function() {

// activate sidenav & formSelect

$(".sidenav").sidenav();
$("#status").formSelect();

// Shows a materialize toast if user tries to publish a post without content

$("form").submit( function(e) {
    if ((tinymce.EditorManager.get('body').getContent()) == '') {
        M.Toast.dismissAll()
        M.toast({html: 'Post can\'t be empty!', displayLength: 2000})
        e.preventDefault()
   }
})

// Shows a materialize toast if user tries to publish a post without a title

$("#title").on("keyup",function() {
   var maxLength = $(this).attr("maxlength");
   if(maxLength == $(this).val().length) {
       M.Toast.dismissAll()
       M.toast({html: 'That title was too long!', displayLength: 2000})
   }
})

// Asks to confirm if a post should be deleted

$(".confirmation").on('click', function(){
    return confirm('Are you sure you want to delete this post?')
    })

})
