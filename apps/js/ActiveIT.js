function activeIt(ID)
{
    const B1=event.target;
    var IdThis=B1.getAttribute('id');
    
    const clickedButton=event.target;
    const contiene=clickedButton.classList.contains("active");
    if (contiene==false)
        {
            clickedButton.classList.add('active'); 
            var hermano=clickedButton.nextElementSibling;
            if (!hermano)
            {
                hermano=clickedButton.previousElementSibling;
            }
            hermano.classList.remove('active');

        }
    if (IdThis=="#kanban")
    {
       // This is the Kanban Frame. 
        
            const kanbanContainer = document.querySelector('.general-container-kanban');
        kanbanContainer.style.display="flex";
        const NotesH1= document.querySelector ('.MainH1'); 
        NotesH1.innerHTML="Kanban";
const NotesContainer = document.querySelector('.general-container-notes');
                NotesContainer.style.display="none";

    }
    else
    {
        // This is the Notes Frames
         const NotesContainer = document.querySelector('.general-container-notes');
                NotesContainer.style.display="flex";

            const kanbanContainer = document.querySelector('.general-container-kanban');
        kanbanContainer.style.display="none";
        const NotesH1= document.querySelector ('.MainH1'); 
        NotesH1.innerHTML="Notes";
    }
    
 
       
}
function AddItem()
{
    const click=event.target;
    const C1=click.closest("#container-to-do");
    const C2=click.closest("#container-doing");
    const C3=click.closest("#container-done"); 
    if (C1==null)
    {
        if (C2==null)
            {
                // ES EL C3
                var inputLocal=document.getElementById("inputDone");
                var IDSelected="listDone";
            }
        else
            {
               //it's C2
                var inputLocal=document.getElementById("inputDoing"); 
                var IDSelected="listDoing";
            }
    }
    else
    {
       //"es el input del primero. C1"
        var inputLocal=document.getElementById("input"); 
        var IDSelected="list";

    }

    let valueInput=inputLocal.value;
    inputLocal.value="";
//create a new dom element list
    let listElement=document.createElement ('li');
    listElement.className = 'draggable-item';
    listElement.draggable = true;
    //Create a check elemenent
    let check=document.createElement('input');
    check.checked=false;
    check.type="checkbox";
// create a paragraph. 
    let textP=document.createElement('p');
    textP.textContent=valueInput;
    textP.classList.add ("to-do-text");
//Create a text node
    let text = document.createTextNode(valueInput);

//Create a button MOVE 
       let buttonMove=document.createElement ('button'); 
  buttonMove.textContent='';
 buttonMove.classList.add("move-button");
    buttonMove.classList.add("button-icon-only"); 
    buttonMove.classList.add("button-icon-drag");
 buttonMove.addEventListener("click",MoveTask);
//Create a button DELETE. 
   let button=document.createElement ('button'); 
     button.classList.add("button-icon-only"); 
    button.classList.add("button-icon-delete");
  button.textContent='';
 button.classList.add("delete-button");

    button.addEventListener("click",DeleteTask);
    
// ++++++++++++++++ add to the DOM++++++++++++++++++++++++++
    inputLocal.appendChild(check);
    //IDSelected.appendChild(listElement); 
   document.getElementById(IDSelected).appendChild(listElement);
    console.log(document.getElementById(IDSelected));
    listElement.appendChild(check);
    // listElement.appendChild(text);
     listElement.appendChild(textP);

 check.classList.add("check-style");
  check.addEventListener("change",LineThrough);
   listElement.appendChild(buttonMove);

   listElement.appendChild(button);
}

function DeleteTask(event)
{
    event.target.parentElement.remove();
}
function MoveTask(event)
{
        const MoveElement=event.target.parentElement;
        event.target.parentElement.remove;
        console.log(MoveElement);
    //const ID=document.getElementById("container-to-do");
    let bigFather = event.target.closest('#container-to-do');
    
    console.log("Apunta al padre con la primera clase",bigFather);
    if (bigFather!==null)
        {
            console.log("There is one",bigFather);
            var DIV2=document.getElementById("listDoing");
            DIV2.appendChild(MoveElement);
        }
    else
        {
            bigFather =event.target.closest('#container-doing'); 
            if (bigFather!==null)
            {
                console.log("There is two");
                DIV2=document.getElementById("listDone");
                 DIV2.appendChild(MoveElement);

            }
            else
                {
                    bigFather =event.target.closest('#container-done'); 
                    if (bigFather!==null)
            {
                    console.log("There is 3");
                    DIV2=document.getElementById("listDone");
                    DIV2.appendChild(MoveElement);

            }

                }

        }
}

function LineThrough(event)
{
  const checkbox=event.target;
  if (checkbox.checked==true)
    {
        const nodo=checkbox.nextElementSibling;
        nodo.style.textDecoration="line-through";
    }
else
    {
        const nodo=checkbox.nextElementSibling;
        nodo.style.textDecoration="none";
    }
 
}