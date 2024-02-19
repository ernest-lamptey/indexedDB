const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

const request = indexedDB.open("CarsDatabase", 1); // (Db name, version)
// we have increment the version number anytime we change the structure of the database

request.onerror = function (event) {
    console.error("An error occurred wiht IndexeddB");
    console.error(event)
}

// When new DB is created or version number is changed
request.onupgradeneeded = function() {
    const db = request.result;
    const store = db.createObjectStore("cars", { keyPath: "id" });
    store.createIndex("cars_colour", ["colour"], { unique: false }); // index to help searches
    store.createIndex("colour_and_make", ["colour", "make"], { unique: false }) // combined index
}

// When DB is successfully opened
request.onsuccess = function () {
    const db = request.result;
    // Everything has to be wrapped inside a transaction
    const transaction = db.transaction("cars", "readwrite"); //readonly or readwrite

    const store = transaction.objectStore("cars");
    const colourIndex = store.index("cars_colour");
    const makeModelIndex = store.index("colour_and_make");

    // adding records
    store.put({id: 1, colour: "Red", make: "Toyota" });
    store.put({id: 2, colour: "Red", make: "Kia" });
    store.put({id: 3, colour: "Blue", make: "Honda" });
    store.put({id: 4, colour: "Silver", make: "Subaru" });

    // reading records
    const idQuery = store.get(4);
    const colourQuery = colourIndex.getAll(["Red"]);
    const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);

    // transaction successes
    idQuery.onsuccess = () => {
        console.log('idQuery', idQuery.result)
    }
    colourQuery.onsuccess = () => {
        console.log('colourQuery', colourQuery.result)
    }
    colourMakeQuery.onsuccess = () => {
        console.log('colourMakeQuery', colourMakeQuery.result)
    }


    transaction.oncomplete = () => {
        db.close()
    }
}