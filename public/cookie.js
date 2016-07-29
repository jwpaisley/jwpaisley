function createCookie(name, value, min) {
    if(min){
        var date = new Date();
        date.setTime(date.getTime()+(min*60*1000));
        var expires = "; expires="+date.toGMTString();
    }else{
        var expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
}

 function readCookie(name) {
    var nameEq = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEq) == 0) return c.substring(nameEq.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}