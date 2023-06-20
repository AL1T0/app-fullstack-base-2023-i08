declare const M;

class Main implements EventListenerObject, HandleResponse {
    private framework: Framework = new Framework();
    private devUrl: string = "http://localhost:8000/devices";
    private usrUrl: string = "http://localhost:8000/users";

    // Request to validate the user login
    private userCheck(username: string, password: string) {
        let user = {username: username, password: password};
        return this.framework.loginRequest("POST", `${this.usrUrl}/login/`, this, user);
    }

    // Request to create a new user in the database
    private addUser(username: string, password: string, type: string) {
        let newUser = { username: username, password: password,  type: type};
        this.framework.addUserRequest("POST", this.usrUrl, this, newUser);
    }

    // Request to get all the devices
    private getDevices() {
        this.framework.devRequest("GET", this.devUrl, this);
    }
  
    // Request to get a specific device by its ID
    private getDeviceByID(devId: number, action: string) {
        return this.framework.devRequestByID("GET", `${this.devUrl}/${devId}`, this, action);
    }

    // Request to edit a device
    private changeDevice(devId: number, name: string, description: string, type: number) {
        let newDevice = {name: name, description: description, type: type};
        this.framework.changeRequest("PUT", `${this.devUrl}/${devId}`, this, newDevice);
    }

    // Request to change the device state or set point
    private changeDevState(devId: number, state: number) {
        let newDevice = {state: state};
        this.framework.changeRequest("PUT", `${this.devUrl}/state/${devId}`, this, newDevice);
    }
    
    // Request to create a new device in the database
    public addDevice(name: string, description: string, type: string) {
        let newDevice = { name: name, description: description,  type: type, state: 0};
        this.framework.addRequest("POST", this.devUrl, this, newDevice);
    }
    // Request to delete a device from the database
    private deleteDevice(devId: number) {
        this.framework.deleteRequest("DELETE", `${this.devUrl}/${devId}`, this);
    }


    // Reload the SPA
    public reloadSPA(tipoModal: string){
        this.getDevices();
        let modal = document.getElementById(tipoModal);
        let instanceModal = M.Modal.getInstance(modal);
        instanceModal.close();
    }

    // Render the devices list
    public loadGrid(devList: Array<Device>) {
        // Hide login area
        let divLogin = document.getElementById("login");
        divLogin.hidden = true;
        // Show the device area header
        let header = document.getElementById("header");
        header.hidden = false;
        let name: string = (<HTMLInputElement>document.getElementById("username")).value;
        let user = document.getElementById("user");
        user.innerHTML = `Hola ` + name + `, estos son tus dispositivos`;
        user.hidden = false; 
        let devArea = document.getElementById("devices");
        let addBtn = document.getElementById("divbtnadd");
        addBtn.hidden = false; 

        // Clear the existing content in the device area
        devArea.innerHTML = "";

        // Create cards with four devices per row
        for (let i = 0; i < devList.length; i += 4) {
            let row = document.createElement("div");
            row.className = "row";

            for (let j = i; j < i + 4 && j < devList.length; j++) {
            let dev = devList[j];

            let card = document.createElement("div");
            card.className = "col s12 m3 card-wrapper";

            let cardContent = `
                <div class="card card-panel">
                <div class="card-content">
                    <i class="material-icons">${dev.type === 1 ? 'lightbulb' : 'window'}</i>
                    <span class="card-title">${dev.name}</span>
                    <p>${dev.description}</p>
                </div>`;

            if (dev.type === 1) {
                cardContent += `
                <div class="switch">
                <br>
                    <label>
                    Off
                    <input id="val_${dev.id}" type="checkbox" ${dev.state ? 'checked' : ''}>
                    <span class="lever"></span>
                    On
                    </label>
                    <br><br>
                </div>`;
            } else if (dev.type === 2) {
                cardContent += `
                <form action="#">
                    <p class="range-field">
                    <input type="range" id="val_${dev.id}" min="0" max="100" step="10" value=${dev.state} aria-valuetext="Valor del dispositivo">
                    </p>
                </form>`;
            }

            cardContent += `
                <br>
                <button class="btn-floating waves-effect teal darken-3">
                    <i class="material-icons" id="btnmod${dev.id}">edit</i>
                </button>
                        
                <button class="btn-floating waves-effect red darken-3">
                    <i class="material-icons" id="btnsub${dev.id}">delete</i>
                </button>
                </div>
            </div>`;

            card.innerHTML = cardContent;
            row.appendChild(card);
            }

            devArea.appendChild(row);
        }

        // Add event listeners to the newly created elements
        for (let dev of devList) {
            document.getElementById("val_" + dev.id).addEventListener("click", this);
            document.getElementById("btnmod" + dev.id).addEventListener("click", this);
            document.getElementById("btnsub" + dev.id).addEventListener("click", this);
        }
    }
    
    // Get device elements to load or delete
    loadDevice(device: Device, action: string) {
        if(action == "edit"){
            (<HTMLInputElement>document.getElementById("edit-id-disp")).value = device.id.toString();
            (<HTMLInputElement>document.getElementById("edit-name")).value = device.name;
            (<HTMLInputElement>document.getElementById("edit-description")).value = device.description;

            let select = document.getElementById("select-edit-type");
            var instanceSelect = M.FormSelect.getInstance(select);
            (<HTMLInputElement>select).value = device.type.toString();
            instanceSelect.destroy();
            M.FormSelect.init(select, "");
        } else if(action == "delete"){
            document.getElementById("id-delete").innerHTML = device.id.toString();
            document.getElementById("name-delete").innerHTML = device.name;
            document.getElementById("desc-delete").innerHTML = device.description;
            (<HTMLInputElement>document.getElementById("input-id-delete")).value = device.id.toString();
        }
    }

    // Open a modal
    openModal(mode: string) {
        let modal = document.getElementById(mode)
        var instanceModal = M.Modal.getInstance(modal);
        instanceModal.open();
    }

    // Close a modal
    closeModal(mode: string) {
        let modal = document.getElementById(mode)
        var instanceModal = M.Modal.getInstance(modal);
        instanceModal.close();
    }

    // Handle the events from the actions on the web page
    handleEvent(object: Event): void {
        let eventObject: HTMLInputElement;
        eventObject = <HTMLInputElement>object.target;
        console.log (eventObject);
        let devState: number;
        let devId: number;

        // Handle by Event Object ID
        switch (eventObject.id) {
            case "btnLogin": {
                const username = (<HTMLInputElement>document.getElementById("username")).value;
                if (username.length === 0) {
                    M.toast({ html: "Debe ingresar un usuario" });
                } else {
                    const password = (<HTMLInputElement>document.getElementById("password")).value;
                    if (password.length === 0) {
                        M.toast({ html: "Debe ingresar una contraseña" });
                    } else {
                        this.userCheck(username, password).then((loginSuccessful) => {
                            if (loginSuccessful) {
                                M.toast({ html: "Login exitoso" });
                                this.getDevices();
                            } else {
                                M.toast({ html: "Error de usuario o contraseña" });
                            }
                        }).catch((error) => {
                            M.toast({ html: "Error desconocido" });
                        });
                    }
                }
                break;
            }

            case "btnAddUser": {
                this.openModal("modaladduser");
                break;
            }

            case "btnCanc": {
                this.closeModal("modaladduser");
                break;
            }
        
            case "btnConf": {
                let username = (<HTMLInputElement>document.getElementById("txt-user")).value;
                let password = (<HTMLInputElement>document.getElementById("txt-pass")).value;
                let type = (<HTMLInputElement>document.getElementById("select-usr-type")).value;
                if (username && password && type) {
                    this.addUser(username, password, type);
                    M.toast({ html: "Usuario creado correctamente" });
                    let modal = document.getElementById("modaladduser");
                    let instanceModal = M.Modal.getInstance(modal);
                    instanceModal.close();
                } else {
                    M.toast({ html: "Debe completar todos los campos" });
                }
                break;
            }
        
            case "btnAddDev": {
                devId = parseInt(eventObject.id);
                this.getDeviceByID(devId, "add");
                this.openModal("modaladd");
                break;
            }
        
            case "btnCancAdd": {
                this.closeModal("modaladd");
                break;
            }
        
            case "btnConfAdd": {
                let name = (<HTMLInputElement>document.getElementById("txt-name")).value;
                let description = (<HTMLInputElement>document.getElementById("txt-description")).value;
                let type = (<HTMLInputElement>document.getElementById("select-type")).value;
                if (name && description && type) {
                    this.addDevice(name, description, type);
                    M.toast({ html: "Dispositivo creado" });
                    this.reloadSPA("modaladd");
                } else {
                    M.toast({ html: "Debe completar todos los campos" });
                }
                break;
            }
        
            case "btnCancEdit": {
                this.closeModal("modalmod");
                break;
            }
        
            case "btnConfEdit": {
                devId = +(<HTMLInputElement>document.getElementById("edit-id-disp")).value;
                let name = (<HTMLInputElement>document.getElementById("edit-name")).value;
                let description = (<HTMLInputElement>document.getElementById("edit-description")).value;
                let type = parseInt((<HTMLInputElement>document.getElementById("select-edit-type")).value);
                if (devId && name && description && type) {
                    this.changeDevice(devId, name, description, type);
                    M.toast({ html: "Dispositivo modificado" });
                    this.reloadSPA("modalmod");
                } else {
                    M.toast({ html: "Debe completar todos los campos" });
                }
                break;
            }
        
            case "btnCancDel": {
                this.closeModal("modaldel");
                break;
            }
        
            case "btnConfDel": {
                devId = +(<HTMLInputElement>document.getElementById("input-id-delete")).value;
                this.deleteDevice(devId);
                M.toast({ html: "Dispositivo eliminado" });
                this.reloadSPA("modaldel");
                break;
            }
        
            default:
                if (eventObject.id.startsWith("btnmod")) {
                    let devId: number = parseInt (eventObject.id.replace('btnmod',''));
                    this.getDeviceByID(devId, "edit");
                    this.openModal("modalmod");
                }
                else if (eventObject.id.startsWith("btnsub")) {
                    let devId: number = parseInt (eventObject.id.replace('btnsub',''));
                    this.getDeviceByID(devId, "delete");
                    this.openModal("modaldel");
                }
                break;
        }

        // Handle by Event Object Type
        switch (eventObject.type) {
        
            case "checkbox": {
                if (eventObject.checked) {
                    devState = 1;
                } else {
                    devState = 0;
                }
                devId = parseInt(eventObject.id.replace('val_', ''));
                this.changeDevState(devId, devState);
                break;
            }
        
            case "range": {
                devState = parseInt(eventObject.value);
                devId = parseInt(eventObject.id.replace('val_', ''));
                this.changeDevState(devId, devState);
                break;
            }
            default:
                // Handle any other cases here
                break;

        } 
    }
}  

// Add event listeners to the web page elements
window.addEventListener("load", () => {
    let main: Main = new Main();

    // Selector menu
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, "");

    // Modals
    var elemsM = document.querySelectorAll('.modal');
    M.Modal.init(elemsM, "");
    
    // User area buttons
    document.getElementById("btnLogin").addEventListener("click", main);
    document.getElementById("btnAddUser").addEventListener("click", main);
    //document.getElementById("btnEditUser").addEventListener("click", main); //TODO
    document.getElementById("btnConf").addEventListener("click", main);
    document.getElementById("btnCanc").addEventListener("click", main);
    
    // Device area buttons
    document.getElementById("btnAddDev").addEventListener("click", main);
    document.getElementById("btnConfDel").addEventListener("click", main);
    document.getElementById("btnCancDel").addEventListener("click", main);
    document.getElementById("btnConfAdd").addEventListener("click", main);
    document.getElementById("btnCancAdd").addEventListener("click", main);
    document.getElementById("btnConfEdit").addEventListener("click", main);
    document.getElementById("btnCancEdit").addEventListener("click", main);
});