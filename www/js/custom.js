$(function (){
   var editor = $(".editor-container");
   editor.editor();
   
   $("#textBxBtn").click(function(){
       editor.addText();
   });
});