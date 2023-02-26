const settings = require("electron-settings");
// const Store = require('electron-store');

// const settings = new Store();


function translate(text) {
    if (!settings.get("general.language") || settings.get("general.language") == "English") {
        return text;
    }
    else {
        try {
            var meta = require("./src/locale/meta.json");
            var locale = require(`./src/locale/${meta[settings.get("general.language")]}`);
            return locale[text] || text;
        }
        catch (e) {
            return text;
        }
    }
}

function translateWrite(text) {
    document.write(translate(text));
}