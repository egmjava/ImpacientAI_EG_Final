window.watsonAssistantChatOptions = {
  integrationID: "025cc130-07d3-4686-85e8-d3aad736d50f", // The ID of this integration.
  region: "us-south", // The region your integration is hosted in.
  serviceInstanceID: "15007de7-d9a2-41e9-90ac-6af756f45b79", // The ID of your service instance.
  onLoad: function(instance) { instance.render(); }
};
setTimeout(function(){
const t=document.createElement('script');
t.src="https://web-chat.global.assistant.watson.appdomain.cloud/loadWatsonAssistantChat.js";
document.head.appendChild(t);
});