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
            $(button).html(`<i class="bi-arrow-up-circle${result.color} me-1" style="font-size: 2rem; color: cornflowerblue;"></i>${result.response}`);
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
            $(button).html(`<i class="bi-arrow-down-circle${result.color} me-1" style="font-size: 2rem; color: cornflowerblue;"></i>${result.response}`);
            return false;
        })
    })
}

//============  FOR COMMENT =================


function ajaxFunctionForComment(btnid){
    i = btnid.value;
    form = "#commentForm"+i;
    input = "#commentInput"+i;
    button = "#allCommentButton"+i;
    recentComment = "#recentComment"+i;
    recentCommentBy = "#recentCommentBy"+i;
    recentCommentUserPhoto = "#recentCommentUserPhoto"+i;
    allCommentButton = "#allCommentButton"+i;
        $(form).unbind('submit').on("submit", function(event){
            event.preventDefault();
            fetch("/newComment", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ajaxPostId: i, ajaxComment: $(input).val()})
            }).then(res => res.json()).then(result => {
                // console.log(result.response);
                $(recentComment).text($(input).val());
                $(recentCommentBy).text(result.user.name);
                $(recentCommentUserPhoto).attr("src", result.user.profilephoto);
                $(input).val("");
                $(allCommentButton).html(`View all ${result.response.length} comments`);
                return false;
            })
        })
}
