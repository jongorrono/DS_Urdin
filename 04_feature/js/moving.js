   let isDragging=false;
    const myButton = document.getElementById("btn-AddIcon");
    const GhostButton=document.getElementById("GhostSvg");
    const canvas=document.getElementById('canvas');


function arrastrar()
{
    console.log("HOLA", myButton);
 
    // Check if the button actually exists to avoid the "null" error
  /*  if (!myButton) 
    let isDragging = false; */

    // 1. Mouse Down
   myButton.addEventListener("mousedown", MouseDown); 
    
    // 2. mouse move
    document.addEventListener("mousemove",MouseMove);
    // 2. Mouse Move
   
    // 3. Mouse Up
    document.addEventListener("mouseup",MouseUp);

// CALL the function so the code inside actually runs

}
function MouseDown()
{
    console.log("THe mouse is down");
    isDragging=true;
    myButton.style.cursor = "grabbing";
}
function MouseMove(event)
{
     
    myButton.style.cursor = "grabbing";
    let AxeX=event.clientX;
    let AxeY=event.clientY;
    console.log("Width:", AxeX, "height:", AxeY);
    const ancho=32;
    const alto=32;
    if (isDragging==true)
        {
            GhostButton.style.display="block";
            GhostButton.style.left=`${AxeX-ancho}px`;
            GhostButton.style.top=`${AxeY-ancho}px`;
        }
}
function MouseUp(event)
{
    isDragging=false;
    console.log("THe mouse is up");
    GhostButton.style.pointerEvents=`none`;
    const NewInput=document.createElement("input");
    NewInput.type="text";
    NewInput.placeholder="Write here...";
    NewInput.style.position="absolute";
    let finalX =event.clientX;
    let finalY=event.clientY;
    const ancho=32;
    NewInput.style.left=`${finalX-ancho}px`;
    NewInput.style.top =`${finalY-ancho}px`;
     NewInput.style.height ="80px";
     NewInput.style.borderRadius="4px";
    canvas.appendChild(NewInput);
    NewInput.focus();

}

arrastrar();