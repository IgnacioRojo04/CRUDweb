const url = "https://api.restful-api.dev/objects"
let idAdd = 0
let data = {}
function getApi() {
    return new Promise((resolve, reject) => {
        fetch(url).then(api => {
            if (!api.ok) {
                throw new Error('Error en la red');
            }
            return api.json();
        }).then(api => {
            resolve(api)
        }).catch(error => {
            reject(error)
        })
    })
}

getApi()
    .then(apiJson =>{
        let tbody = document.getElementsByTagName("tbody")[0]
        tbody.innerHTML = ""
        
        Object.values(apiJson).forEach(element => {

            let newRow = tbody.insertRow()
            let cellID = newRow.insertCell()
            let cellName = newRow.insertCell()
            cellID.innerHTML = element.id
            
            if (Number(element.id) > idAdd) idAdd =Number(element.id)+1
            cellName.innerHTML = element.name

            if (element.data != null){
                Object.entries(element.data).forEach(([key, value]) => {
                    let newCell = newRow.insertCell();
                    newCell.innerHTML = `${key}: ${value}`
                })
            }
            else  {
                let cellData = newRow.insertCell()
                cellData.innerHTML = 'No hay datos'
            }

            let cellupdateButton =  newRow.insertCell()
            cellupdateButton.innerHTML = `<button onclick='Update("${element.id}", this)'>Update</button>` 
            let cellDeleteButton = newRow.insertCell()
            cellDeleteButton.innerHTML = `<button onclick='deleteCell("${element.id}", this)'>Delete</button>`;

            
        });       
    })

    function deleteCell(id, buttonElement) {

        fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el elemento');
            }
            return response.json();
        })
        .then(() => {
            let row = buttonElement.parentNode.parentNode;
            row.parentNode.removeChild(row);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


    function dataMake() {
        
        if(document.getElementById('DataName').value !== ''){
            const dataName = document.getElementById('DataName').value;
            const datahtml = document.getElementById('Data').value;

            data[dataName] = datahtml;

            const attributeHTML = `<p>${dataName}: ${datahtml}</p>`;
            document.getElementById('dataMakes').innerHTML += attributeHTML;

            document.getElementById('DataName').value = "";
            document.getElementById('Data').value = "";

            return data
        }else{
            data = null
            return data
        }
    }

    function postPhone(cellphone) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest()
            xhr.open('POST', url)
            xhr.setRequestHeader('Content-Type', 'application/json')
    
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {                   
                    try {
                        let responseJson = JSON.parse(xhr.responseText);
                        resolve(responseJson);
                    } catch (e) {
                        reject(Error("Invalid JSON: " + xhr.responseText));
                    }
                } else {
                    reject(Error(xhr.status + " || " + xhr.statusText))
                }
            }

            xhr.send(cellphone)
            data = {}
            document.getElementById('dataMakes').innerHTML = ""
        })
    }

    function addCellphone() {

        if (document.getElementById('name').value !== ''){

            let data = dataMake()
            let cellphone = JSON.stringify({
                'name': document.getElementById('name').value,
                'data': data,
            })
            postPhone(cellphone).then(response => {

                let tbody = document.getElementsByTagName('tbody')[0]
                let newRow = tbody.insertRow()
                let cellID = newRow.insertCell()
                cellID.innerHTML = idAdd++
                let cellName = newRow.insertCell()
                cellName.innerHTML = document.getElementById('name').value

                if (data !== null) {
                    for (let key in data) {
                        let cellData = newRow.insertCell()
                        cellData.innerHTML = `${key}: ${data[key]}`
                    }
                } else if (data == null){
                    let cellData = newRow.insertCell()
                    cellData.innerHTML = 'No hay datos'
                }
                let cellupdateButton =  newRow.insertCell()
                let cellDeleteButton = newRow.insertCell()
                
                console.log(data)
                cellupdateButton.innerHTML = `<button onclick='Update("${response.id}", this)'>Update</button>` 
                cellDeleteButton.innerHTML = `<button onclick = 'deleteCell("${response.id}", this)'>Delete</button>`
            })
        }
        else {
            alert("Falta nombre")
        }
        
    }
    
    function newDataMake(){
        if(document.getElementById('newDataName').value !== '' & document.getElementById('newData').value !== ''){
        const dataName = document.getElementById('newDataName').value;
        const datahtml = document.getElementById('newData').value;
    
        data[dataName] = datahtml;
    
        const attributeHTML = `<p>${dataName}: ${datahtml}</p>`;
        document.getElementById('newdataMakes').innerHTML += attributeHTML
    
        document.getElementById('newDataName').value = ""
        document.getElementById('newData').value = ""
    
        console.log(data)
        return data
    }else{
        return data
    }
    }
    function putCellphone(cellphone, id) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest()
            xhr.open('PUT', `${url}/${id}`)
            xhr.setRequestHeader('Content-Type', 'application/json')
    
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log("Respuesta de la API:" + xhr.responseText + "!");
                    try {
                        let responseJson = JSON.parse(xhr.responseText);
                        console.log(responseJson)
                        resolve(responseJson);
                    } catch (e) {
                        reject(Error("Invalid JSON: " + xhr.responseText));
                    }
                } else {
                    reject(Error(xhr.status + " || " + xhr.statusText))
                }
            }
            document.getElementById('dataMakes').innerHTML = ""
            console.log(cellphone)
            document.getElementById("update").value = ""
            xhr.send(cellphone)
            data = {}
    
        })
    
    }

    function deleteCell(id, buttonDelete) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', `${url}/${id}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
    
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(`Delete Cellphone`);
                deleteCellHTML(buttonDelete)
            } else {
                console.error(`Error: ${xhr.status} ${xhr.statusText} ${id}`);
            }
        };
        xhr.send(id);
    }
    function deleteCellHTML(buttonDelete) {
        buttonDelete.parentNode.parentNode.remove()
    }
    function updateCell(id, buttonupdate) {
        let data = newDataAtribute()
        let newname =  document.getElementById('newName').value
        let cellphone = JSON.stringify({
            'id': idAdd,
            'name': document.getElementById('newName').value,
            'data': data,
        })
        document.getElementById("update").innerHTML = ""
        putCellphone(cellphone, id).then(response => {
            deleteCellHTML(buttonupdate)
            console.log(response.id)
            let tbody = document.getElementsByTagName('tbody')[0]
            let newRow = tbody.insertRow()
            let cellID = newRow.insertCell()
            cellID.innerHTML = idAdd
            let cellName = newRow.insertCell()
            let cellupdateButton = newRow.insertCell()
            let cellDeleteButton = newRow.insertCell()
            cellName.innerHTML = newname
            cellDeleteButton.innerHTML = `<button onclick = 'deleteCell("${response.id}", this)'>Delete</button>`
            cellupdateButton.innerHTML = `<button onclick='openDivupdate("${response.id}", this)'>update</button>` 
            console.log(data)
            if (data !== null) {
                for (let key in data) {
                    let cellData = newRow.insertCell()
                    cellData.innerHTML = `${key}: ${data[key]}`
                }
            } else {
                let cellData = newRow.insertCell()
                cellData.innerHTML = 'No hay datos'
            }
    
        })}

    function Update(id, buttonUpadte){
        let divUp = document.getElementById("update");
        console.log(buttonUpadte);

        let h5 =  document.createElement("h5");
        h5.innerText = "Modificar Datos"
        divUp.appendChild(h5);

        let newNameInput = document.createElement("input");
        newNameInput.type = "text";
        newNameInput.id = "newName";
        newNameInput.placeholder = "Name";
        divUp.appendChild(newNameInput);

        let newDataNameInput = document.createElement("input");
        newDataNameInput.type = "text";
        newDataNameInput.id = "newDataName";
        newDataNameInput.placeholder = "DataName";
        divUp.appendChild(newDataNameInput);

        let newDataInput = document.createElement("input");
        newDataInput.id = "newData";
        newDataInput.placeholder = "Data";
        divUp.appendChild(newDataInput);

        let newdataMakesDiv = document.createElement("div");
        newdataMakesDiv.id = "newdataMakes";
        divUp.appendChild(newdataMakesDiv);

        let addAttributeBtn = document.createElement("button");
        addAttributeBtn.id = "NewaddAttribute";
        addAttributeBtn.onclick = newDataAtribute;
        addAttributeBtn.innerHTML = "Agregar atributo";
        divUp.appendChild(addAttributeBtn);

        let UpadteBtn = document.createElement("button");
        UpadteBtn.type = "submit";
        UpadteBtn.onclick = function() {
            upadteCellphone(id, buttonUpadte);
        };
        UpadteBtn.innerHTML = "Upadte Cellphone";
        divUp.appendChild(UpadteBtn);
    }