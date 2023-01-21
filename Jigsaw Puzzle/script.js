function playAudio(){
    var x = document.getElementById("myAudio");
    this.play();
  }

  var myAudio = document.createElement('audio');
  myAudio.controls = true;
  myAudio.src = 'audio/drop.mp3';
  myAudio.src = 'audio/beep.wav';

  $(document).ready(function(){ 
    var rows=4, columns=4;
    var pieces = "";
    for (var i=0,top=0,order=0;i<rows;i++,top-=100)
    {
      for(var j=0,left=0;j<columns;j++,left-=100,order++)
      {
        pieces += "<div style='background-position:" 
        + left + "px " + top + "px;' class='piece' data-order="+ order +"> </div>";
      }
    }
    $("#puzzleContainer").html(pieces);
    $("#btnStart").click(function(){
      var pieces = $("#puzzleContainer div");
      pieces.each(function(){
        var leftPosition =
        Math.floor(Math.random()*290) + "px";
        var topPosition =
        Math.floor(Math.random()*290) + "px";
        $(this).addClass("draggablePiece")
        .css({
          position: "absolute",
          left: leftPosition,
          top: topPosition
      })
      $("#pieceContainer").append($(this));
      });
      var emptyString = "";
      for (var i=0;i<rows;i++)
        {
        for(var j=0;j<columns;j++)
          {
            emptyString += "<div style='background-image:none;' class='piece droppableSpace'></div>";
          }
        }
        $("#puzzleContainer").html(emptyString); 
        $(this).hide();
        $("#btnReset").show();
        implementLogic();
    });

    function myFunction() {
    document.body.style.background = "url('blurred.png')";
  }

    function checkIfPuzzleSolved(){
      if ($("#puzzleContainer.droppedPiece").length !=16){
        return false;
      }
      for(var k=0; k<16 ; k++)
      {
        var item = $("#puzzleContainer.droppedPiece:eq(" + k + ")");
        var order = item.data("order");
        if(k != order){
          $("#pieceContainer").text("Wrong!");
          return false;
        }
      }
      $("pieceContainer").text("Correct");
      return true;
    }


    function implementLogic(){
      $(".draggablePiece").draggable({
        revert:"invalid",
        start:function(){
          if($(this).hasClass("droppedPiece"))
          {
            $(this).removeClass("droppedPiece");

            $(this).parent().removeClass("piecePresent");
          }
        }
      });
      $(".droppableSpace").droppable({
        accept:function(){
          return !$(this).hasClass("piecePresent");
        },

        drop:function(event,ui){
          var draggableElement = ui.draggable;
          var droppedOn = $(this);
          droppedOn.addClass("piecePresent");
          $(draggableElement)
            .addClass("droppedPiece")
            .css({
              top:0,
              left:0,
              position:"relative"
            }).appendTo(droppedOn);

            myAudio.play();
            checkIfPuzzleSolved();
        }
      });
    }
  });

  const draggables = document.querySelectorAll('.draggable')
  const containers = document.querySelectorAll('.container')
  
  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging')
    })
  
    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging')
    })
  })
  
  containers.forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault()
      const afterElement = getDragAfterElement(container, e.clientY)
      const draggable = document.querySelector('.dragging')
      if (afterElement == null) {
        container.appendChild(draggable)
      } else {
        container.insertBefore(draggable, afterElement)
      }
    })
  })
  
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
  
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element
  }  