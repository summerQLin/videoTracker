# API design

POST /videos/insert   -d {"url":"https://www.youtube.com/watch?v=bh0j_-NuozA", "comments":"My favorate!"}

return 200 {"id":xxxx}
       500 {"error": "error message returned from server"} //internal error
       400 url exists //not implement yet

       
PUT 
 * /videos/update/download/end/568f5e084d55d78015ffc890  -d {"file_size":"50M", "file_path":"/Downloads/video.mv", "download_status":true, "download_msg":"complete"}
 * /videos/upload/start/568f5e084d55d78015ffc890  
 * /videos/upload/end/568f5e084d55d78015ffc890   -d {"upload_status":true, "upload_msg":"complete"}
                  
return 
  * 200 //update successfully
  * 500 {"error":"error returned from server"} //internal error


GET /videos/568f5e084d55d78015ffc890

GET /videos

