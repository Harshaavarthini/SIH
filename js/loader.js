window.eventdone = {};

window.loadAsyncScript = function(url, onLoadFunction) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    document.body.appendChild(script);
    script.onload = onLoadFunction;
    script.src = url;
};

window.executeOnEventDone = function(eventName, callback) {
    if (window.eventdone[eventName]) {
        try {
            callback();
        } catch (e) {
            console.log(e);
        }
    } else {
        window.addEventListener(eventName, callback);
    }
};

window.fireBasicEvent = function(eventName) {

    if (typeof(Event) === 'function') {
        var event = new Event(eventName);
    } else {
        // IE compatibility
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
    }

    window.eventdone[eventName] = true;
    window.dispatchEvent(event);
};

window.addEventListener('load', function() {

    var scripts = document.getElementsByTagName('script');
    var deferredScripts = Array.from(scripts).filter(script => script.getAttribute('data-deferredsrc'));

    function loadDeferredScript(i) {

        var script = deferredScripts[i];

        if (i >= deferredScripts.length) {
            window.fireBasicEvent('deferredload');
            window.fireBasicEvent('afterDeferredload');
            return;
        }

        script.onload = script.onerror = function() {
            // load next deferred script
            loadDeferredScript(i + 1);
        };

        script.setAttribute("src", script.getAttribute("data-deferredsrc"));
        script.removeAttribute("data-deferredsrc");
    }

    loadDeferredScript(0);
});