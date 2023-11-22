// =============== FOR AJAX ================

function ajaxFunctionForUpvote(btnid){
      i = btnid.value;
      form = "#upvoteForm"+i;
      input = "#upvoteInput"+i;
      button = "#upvoteButton"+i;
      $(form).unbind('submit').on("submit", function(event){
        event.preventDefault();
        fetch("/upvote", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ajaxPostId: $(input).val()})
        }).then(res => res.json()).then(result => {
            // console.log(result.response);
            $(button).html(`<i class="fa fa-arrow-up"></i> Upvote(${result.response})`);
            return false;
        })
    })
}


function ajaxFunctionForDownvote(btnid){
      i = btnid.value;
      form = "#downvoteForm"+i;
      input = "#downvoteInput"+i;
      button = "#downvoteButton"+i;
      $(form).unbind('submit').on("submit", function(event){
        event.preventDefault();
        fetch("/downvote", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ajaxPostId: $(input).val()})
        }).then(res => res.json()).then(result => {
            // console.log(result.response);
            $(button).html(`<i class="fa fa-arrow-up"></i> Downvote(${result.response})`);
            return false;
        })
    })
}
