function changeColor(){
    var color = document.getElementById("MyTitle").style.color;
    color = color==="red"?"blue":"red";
    document.getElementById("MyTitle").style.color = color;
    console.log("color changed");
}