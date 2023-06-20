class Framework{

  // Method to validate a user by its username and password
  public loginRequest(method: string, url: string, responseHandler: HandleResponse, data: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
          if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
            resolve(true); // The promise is to indicate login success or error
          } else if (xmlHttp.status == 401) {
            resolve(false);
          } else {
            alert("ERROR en la consulta");
            resolve(false);
          }
        }
      }
      xmlHttp.open(method, url, true);
      xmlHttp.setRequestHeader('Content-Type', 'application/json');
      xmlHttp.send(JSON.stringify(data));
    });
  }

  // Method to add a new user
  public addUserRequest(method: string, url: string, responseHandler:HandleResponse, data: any) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          console.log(xmlHttp.responseText);
        } else {
          alert("ERROR en la consulta");
        }
      }
    }
    xmlHttp.open(method, url, true);
    if (data != undefined) {
      xmlHttp.setRequestHeader("Content-Type", "application/json");  
      xmlHttp.send(JSON.stringify(data));
    }
  }
    
  // Method to bring all the devices from the DB
  public devRequest(method: string, url: string, responseHandler:HandleResponse){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
          if (xmlHttp.status == 200) {
              let listaDisp: Array<Device> = JSON.parse(xmlHttp.responseText);
              responseHandler.loadGrid(listaDisp);
            } else {
                alert("ERROR en la consulta");
            }
          }
        }
    xmlHttp.open(method, url, true);
    xmlHttp.send();
  }

  // Method to get a device by its ID
  public devRequestByID(method: string, url: string, responseHandler:HandleResponse, action: string) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          let device: Device = JSON.parse(xmlHttp.responseText);
          responseHandler.loadDevice(device[0], action);
        } else {
          alert("ERROR en la consulta");
        }
      }
    }
    xmlHttp.open(method, url, true);
    xmlHttp.send();
  }

  // Method to change a device state or edit device properties
  public changeRequest(method: string, url: string, responseHandler:HandleResponse, data: any) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
          if (xmlHttp.status == 200) {
            console.log(xmlHttp.responseText); 
            } else {
                alert("ERROR en la consulta");
            }
          }
        }
    xmlHttp.open(method, url, true);
    if (data != undefined) {
      xmlHttp.setRequestHeader("Content-Type", "application/json");  
      xmlHttp.send(JSON.stringify(data));
    }
  }

  // Method to add a new device to the DB
  public addRequest(method: string, url: string, responseHandler:HandleResponse, data: any) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          console.log(xmlHttp.responseText);
        } else {
          alert("ERROR en la consulta");
        }
      }
    }
    xmlHttp.open(method, url, true);
    if (data != undefined) {
      xmlHttp.setRequestHeader("Content-Type", "application/json");  
      xmlHttp.send(JSON.stringify(data));
    }
  }

  // Method to delete a device from the DB
  public deleteRequest(method: string, url: string, responseHandler:HandleResponse) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          console.log(xmlHttp.responseText);
        } else {
          alert("ERROR en la consulta");
        }
      }
    }
    xmlHttp.open(method, url, true);
    xmlHttp.send();
  }
}