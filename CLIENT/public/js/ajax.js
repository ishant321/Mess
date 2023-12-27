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


//===============================FOR SOLVED==================================
function solvedForm( btnid){
    i = btnid.value;
    form = "#solvedForm"+i;
    postId = "#idForStatusSolved"+i;
    sbuttonId ="#solvedButton"+i;
    dbuttonId ="#unsolvedButton"+i; 

    const status = "solved";
    $(form).unbind('submit').on("submit", function(event){
        event.preventDefault();
        fetch("/solved", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ajaxValue: status, postid: $(postId).val()})
        }).then(res => res.json()).then(result => {
                       
            $(dbuttonId).removeClass(result.response);
            $(sbuttonId).addClass(result.response);    
            return false;
        })
    })      
}
//=============================== ! FOR SOLVED==================================


//===============================FOR UNSOLVED==================================
function unsolvedForm( btnid){
    i = btnid.value;
    // alert(i);
    form = "#unsolvedForm"+i;
    postId = "#idForStatusUnsolved"+i;
    sbuttonId ="#solvedButton"+i;
    dbuttonId ="#unsolvedButton"+i; 
    const status = "unsolved";
    $(form).unbind('submit').on("submit", function(event){
        event.preventDefault();
        fetch("/unsolved", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ajaxValue: status, postid: $(postId).val()})
        }).then(res => res.json).then(result => {
           
            $(dbuttonId).addClass(result.response);
            $(sbuttonId).removeClass(result.response);
            return false;
        })
    })      
}
//=============================== ! FOR UNSOLVED==================================



//============================== FOR BLOCKED =================================
function bsendCheckboxState(btnId,passesdValue) {
    i = btnId.value;
    // alert(i)
    const checkbox = document.getElementById('bmyCheckbox' + i);
    const checkboxState = checkbox.checked ? 1 : 0;
    const data = {
      checkboxState: i
    };


    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/server/bscript.js'); // Changed to JavaScript endpoint
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log('Checkbox state sent to server:', xhr.responseText);
      } else {
        console.error('Error sending checkbox state to server:', xhr.statusText);
      }
    };
  }

//==============================! FOR BLOCKED =================================


//==============================FOR UNBLOCKED===============================\
function usendCheckboxState(btnId,passesdValue) {
    i = btnId.value;
    // alert(i)
    const checkbox = document.getElementById('umyCheckbox' + i);
    const checkboxState = checkbox.checked ? 1 : 0;
    const data = {
      checkboxState: i
    };


    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/server/uscript.js'); // Changed to JavaScript endpoint
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log('Checkbox state sent to server:', xhr.responseText);
      } else {
        console.error('Error sending checkbox state to server:', xhr.statusText);
      }
    };
  }

//============================== !FOR UNBLOCKED===============================




//=============================== FLOATING NOTIFICATION===========================

          $(document).ready(function () {




            var down = false;

            $('#bell').click(function (e) {

              var color = $(this).text();
              if (down) {

                $('#box').css('height', '0px');
                $('#box').css('opacity', '0');
                down = false;
              } else {

                $('#box').css('height', 'auto');
                $('#box').css('opacity', '1');
                down = true;

              }

            });

          });

//=============================== !FLOATING NOTIFICATION===========================