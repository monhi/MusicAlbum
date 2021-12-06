// function ProcessToast(str)
// {
//   var toastLiveExample = document.getElementById('liveToast');
//   let info = document.getElementById('info');
//   info.textContent = str;
//   var toast = new bootstrap.Toast(toastLiveExample);			
//   toast.show();	
// }

window.onload = function() 
{
    let deleteMusics  = document.getElementById("deletemusics");
    if (document.getElementById('currentMusics').options.length == 0) 
    {
        deleteMusics.disabled = true;
    }
};

function SubmitNewMusicFile()
{
    let _validFileExtensions = [".mp3"]; 

    const input = document.getElementById("musicFile");
    

    if (input.files.length == 0) 
    {
        document.getElementById("mp3uploadresult").textContent  = "File name is empty";
        document.getElementById("mp3uploadresult").style.color  = "Red";        
        setTimeout(() => { 
            document.getElementById("mp3uploadresult").textContent  = ""; 
            document.getElementById("mp3uploadresult").style.color  = "Black";
         }, 2000);
        return;
    }

    // check file extention to be one of mp3 or wav file formats
    if (input.files[0].name.length > 0)
    {
        let fileName = input.files[0].name;
        let blnValid = false;
        for (let j = 0; j < _validFileExtensions.length; j++) 
        {
            let sCurExtension = _validFileExtensions[j];
            if (fileName.substr(fileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) 
            {
                blnValid = true;
                break;
            }
        }
        
        if (!blnValid)
        {
            document.getElementById("mp3uploadresult").textContent  = "File extension error";
            document.getElementById("mp3uploadresult").style.color  = "Red";        
            setTimeout(() => { 
                document.getElementById("mp3uploadresult").textContent  = ""; 
                document.getElementById("mp3uploadresult").style.color = "Black";
                }, 2000);                        
            return;
        }
    }
    
    const formData = new FormData();
    formData.append("musicFile",input.files[0] );

    fetch('/newfile', { // Your POST endpoint
    method: 'POST',
    headers: 
    {
        'Accept': 'application/json',
    },
    body: formData // This is your file object
  }).then(
    response => response.json() // if the response is a JSON object
  ).then(
    (data) =>{
      console.log(JSON.stringify(data));
      const {result , param } = data;
      if('Success' == result)
      {
          document.getElementById("mp3uploadresult").textContent  = result + " : " + param;
          document.getElementById("mp3uploadresult").style.color  = "Green";        
          setTimeout(() => { 
              document.getElementById("mp3uploadresult").textContent  = ""; 
              document.getElementById("mp3uploadresult").style.color = "Black";
              }, 2000);
      }
      else
      {
        document.getElementById("mp3uploadresult").textContent    = result + " : " + param;
        document.getElementById("mp3uploadresult").style.color    = "Red";
        setTimeout(() => { 
            document.getElementById("mp3uploadresult").textContent  = ""; 
            document.getElementById("mp3uploadresult").style.color = "Black";
            }, 2000);
      }
    }
  ).catch(
    error =>{
      console.log(error) // Handle the error response object
      document.getElementById("mp3uploadresult").textContent  = "Adding file failed";
      document.getElementById("mp3uploadresult").style.color  = "Red";
      setTimeout(() => { 
          document.getElementById("mp3uploadresult").textContent  = ""; 
          document.getElementById("mp3uploadresult").style.color = "Black";
          }, 2000);
    } 
  );
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