
window.onload = function() 
{
    let len = document.getElementById("mymusic").getElementsByTagName("li").length;
    if(len>0)
    {
        PlayEnded(len-1);
    }   
};

function PlayEnded(i)
{
    let length = document.getElementById("mymusic").getElementsByTagName("li").length;
    console.log("audio number "+ i + " ended");
    let idx   = i+1;
    idx       = idx % length;
    let id    = "Audio" + idx;
    console.log("Going to play: " + id );
    document.getElementById(id).play();
}


function SubmitRefreshMusics() {
  fetch("/album/refresh", {
      method: "POST",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({})
  })
      .then(res => res.json())
      .then(musics => {


          let currentMusics = document.getElementById("currentMusics");
          let deleteMusics  = document.getElementById("deletemusics");
          let contents;

          console.log('Result is'+ JSON.stringify(musics));
          if( JSON.stringify(musics) == '{}' )
          {             
              contents = '';
              deleteMusics.disabled = true;
          }
          else
          {
              musics.forEach((o) => {
                contents += "<option>" + o.name + "</option>";
              });
              deleteMusics.disabled = false;
          }
          currentMusics.innerHTML = contents;

          document.getElementById("editmusicsresult").textContent = "Refresh done!";
          document.getElementById("editmusicsresult").style.color = "Green";
          document.getElementById("editmusicsresult").style.fontSize = "large";
          setTimeout(() => { document.getElementById("editmusicsresult").textContent = "" }, 2000);
      })
      .catch(err => {
          document.getElementById("editmusicsresult").textContent = err;
          document.getElementById("editmusicsresult").style.color = "Red";
          document.getElementById("editmusicsresult").style.fontSize = "large";
          setTimeout(() => { document.getElementById("editmusicsresult").textContent = "" }, 2000);
      });
}

function SubmitDeleteMusic() 
{
  var u = document.getElementById("currentMusics").value;

  fetch("/album/deletemusic", {
      method: "DELETE",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          musicname: u
      })
  })
      .then(res => res.json())
      .then(data => {
          const { result, param } = data;
          document.getElementById("editmusicsresult").textContent = "   " + result + " : " + param;
          if (result.toLowerCase() == "success") {
              document.getElementById("editmusicsresult").style.color = "Green";
          }
          else {
              document.getElementById("editmusicsresult").style.color = "Red";
          }

          document.getElementById("editmusicsresult").style.fontSize = "large";
          setTimeout(() => { document.getElementById("editmusicsresult").textContent = "" }, 2000);

      })
      .catch(err => {
          document.getElementById("editmusicsresult").textContent = err;
          document.getElementById("editmusicsresult").style.color = "Red";
          document.getElementById("editmusicsresult").style.fontSize = "large";
          setTimeout(() => { document.getElementById("editmusicsresult").textContent = "" }, 2000);
      });
}