let colores =["green","black","red","blue", "yellow","white", "brown","purple","pink"]

function CambiarFondo (){
    let indice = parseInt(Math.random()*10);
    let color = colores[indice];
    document.querySelector("body").style.background=color;
}