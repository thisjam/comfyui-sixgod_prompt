import { app } from "../../../../web/scripts/app.js";
import { api } from "../../../../web/scripts/api.js";
// import { ComfyWidgets } from "../../../../web/scripts/widgets.js";
// import { addStylesheet } from "../../../../web/scripts/utils.js";
 
function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}

function executed(callback) {
  api.addEventListener("executed", (data) => {
    let node=app.graph._nodes_by_id[data.detail.node]
    if(node.type!="SixGodPrompts_PreviewImage")
      return;
    let baseUrl = `http://${data.target.api_host}/api/view`;
    let res = data?.detail?.output?.images?.[0];
    if(!res) return;
    let paramsObject = {
      filename: res.filename,
      subfolder: res.subfolder,
      type: res.type,
    };
    const queryString = objectToQueryString(paramsObject);
    const fullUrl = `${baseUrl}?${queryString}`;
    callback&&callback(fullUrl);
  });
}

function progress(callback) {
  api.addEventListener("progress", (data) => {
    callback&&callback(data);
  });
   
   
  
}

 
function register(executedCallback, progressCallback) {
  app.registerExtension({
    name: "sixgod_prompts_Text",
    async setup() {
      executed(executedCallback);
      progress(progressCallback);
    },
  });
}

export { register };

 
