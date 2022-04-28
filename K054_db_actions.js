const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./Database/data.db");

function insertUser(name, email, pass) {
    db.run("INSERT INTO Users(Name, Email, Pass) VALUES (?,?,?)", [name, email, pass], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Rows USERS inserted ${this.changes}`);
      });
}

function getUser(userEmail, callback) {
  var arr = [];
  db.all("SELECT * FROM Users Where Users.Email = (?)", [userEmail], (error, rows) => {
    rows.forEach((row) => {
      arr.push({ userID: row["ID"], name: row["Name"], email: row["Email"] });
    });
    callback(arr);
    console.log("use");
    
  });
}

function insertHouse(userID, title) {
    db.run("INSERT INTO Houses(Title, UserID) VALUES (?,?)", [title, userID], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Rows Houses inserted ${this.changes}`);
      });
}

function insertRoom(title, backgroundPath, houseID) {
    db.run("INSERT INTO Rooms(Title, BackgroundPath, HouseID) VALUES (?,?,?)", [title, backgroundPath, houseID], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Rows Rooms inserted ${this.changes}`);
      });
}

function insertDevice(title, categoryID, roomID) {
    db.run("INSERT INTO Devices(Title, CategoryID, RoomID) VALUES (?,?,?)", [title, categoryID, roomID], function(err) {
        if (err) {
          return console.error(err.message);
        }
        console.log(`Rows Devices inserted ${this.changes}`);
      });
}

function deleteDevice(deviceID) {
  db.run("DELETE FROM Devices WHERE ID=(?)", [deviceID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows REMOVED ${this.changes}`);
  });
}

function deleteHouse(houseID) {
  db.run("DELETE FROM Devices WHERE RoomID IN (SELECT ID FROM Rooms WHERE HouseID = (?))", [houseID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows REMOVED ${this.changes}`);
  });
  db.run("DELETE FROM Rooms Where HouseID = (?)", [houseID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows REMOVED ${this.changes}`);
  });
  db.run("Delete FROM Houses WHERE ID = (?)", [houseID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows REMOVED ${this.changes}`);
  });
}

function deleteRoom(roomID) {
  db.run("DELETE FROM Devices WHERE RoomID = (?)", [roomID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows REMOVED ${this.changes}`);
  });
  db.run("DELETE FROM Rooms Where ID = (?)", [roomID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows REMOVED ${this.changes}`);
  });
}

function updateRoom(roomID, title, backgroundPath) {
  db.run("UPDATE Rooms SET Title = (?), BackgroundPath = (?) WHERE ID = (?)", [title, backgroundPath, roomID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows UPDATED ${this.changes}`);
  });
}

function updateHouse(houseID, title) {
  db.run("UPDATE Houses SET Title = (?) WHERE ID = (?)", [title, houseID], function(err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Rows UPDATED ${this.changes}`);
  });
}

function getHouses(userID, callback) {
    var arr = [];
    db.all("SELECT * FROM Houses Where UserID = (?)", [userID], (error, rows) => {
      rows.forEach((row) => {
        arr.push({ id: row["ID"], title: row["Title"], userID: row["UserID"] });
      });
      callback(arr);
      console.log("HOUSES");
      
    });
}

function getRooms(houses, callback) {
    var allRooms = new Object;
    var counter = 0;
    houses.forEach((house) => {
        var rooms = [];
        db.all("SELECT * FROM Rooms Where HouseID = (?)", [house.id], (error, rows) => {
            rows.forEach((row) => {
              rooms.push({ id: row["ID"], title: row["Title"], backgroundImage: row["BackgroundPath"] });
            });
            allRooms[[house.id]] = rooms;
            counter++;
            if(counter == houses.length)
            {
              callback(allRooms);
              console.log("ROOMS");
            }
        });
    });
}
function getDevices(houses, callback) {
  var allDevices = new Object;
  var counter = 0;
  var totalLe=0;
  for (let i = 0; i < Object.keys(houses).length; i++) {
      var rooms = houses[Object.keys(houses)[i]];
      totalLe+=rooms.length;
      rooms.forEach((room) => {
          var devices = [];
            db.all("SELECT Devices.*, Category.Title AS catTitle, Category.Icon From Devices LEFT JOIN Category ON Devices.CategoryID = Category.ID WHERE RoomID = (?)", [room.id], (error, rows) => {
              rows.forEach((row) => {
                devices.push({ id: row["ID"], title: row["Title"], cateogry: {id: row["CategoryID"], title: row["catTitle"], icon: row["Icon"]} });
              });
              if(devices.length!=0)
              {
                allDevices[[room.id]] = devices;
              }
              counter++;
              if(counter == totalLe)
              {
                callback(allDevices);
                console.log("Devices");
              }
          });
      });
      
  }
}

function getAllDevicesFromHouse(houseID, callback) {
  var devices = [];
  db.all("SELECT Devices.*, Category.Title AS catTitle, Category.Icon From Devices LEFT JOIN Category ON Devices.CategoryID = Category.ID WHERE RoomID IN (SELECT ID FROM Rooms WHERE HouseID = (?))", [houseID], (error, rows) => {
    rows.forEach((row) => {
      devices.push({ id: row["ID"], title: row["Title"], cateogry: {id: row["CategoryID"], title: row["catTitle"], icon: row["Icon"]} });
    });
    callback(devices);
  });
}

function getAllDevicesFromRoom(roomID, callback) {
  var devices = [];
  db.all("SELECT Devices.*, Category.Title AS catTitle, Category.Icon From Devices LEFT JOIN Category ON Devices.CategoryID = Category.ID WHERE RoomID = (?)", [roomID], (error, rows) => {
    rows.forEach((row) => {
      devices.push({ id: row["ID"], title: row["Title"], cateogry: {id: row["CategoryID"], title: row["catTitle"], icon: row["Icon"]} });
    });
    callback(devices);
  });
}

module.exports = { insertUser, getUser, insertHouse, insertRoom,insertDevice, getHouses, getRooms, getDevices, deleteDevice, deleteHouse, deleteRoom, updateRoom, updateHouse,
                  getAllDevicesFromHouse, getAllDevicesFromRoom};