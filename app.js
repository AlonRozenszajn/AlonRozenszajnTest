'use strict';

url = 'https://www.geektime.co.il/source-defense-raises-10-5-m/'
var report;

// app window
function openInChrome(url) {
    chrome.runtime.sendMessage({ action: "openURL", url: url });
    ExportData();
}
window.addEventListener('onbeforeunload',ExportData())
// background
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action == "openURL") window.open(message.url);
});

function ExportData() {
    wait(30000)
    console.defaultLog = console.log.bind(console);
    console.logs = [];
    console.log = function () {
        // default &  console.log()
        console.defaultLog.apply(console, arguments);
        // new & array data
        console.logs.push(Array.from(arguments));
        
    }

    console.defaultError = console.error.bind(console);
    console.errors = [];
    console.error = function () {
        // default &  console.error()
        console.defaultError.apply(console, arguments);
        // new & array data
        console.errors.push(Array.from(arguments));
    }

    function captureNetworkRequest(e) {
        var capture_network_request = [];
        var capture_resource = performance.getEntriesByType("resource");
        for (var i = 0; i < capture_resource.length; i++) {
            if (capture_resource[i].initiatorType == "xmlhttprequest" || capture_resource[i].initiatorType == "script" || capture_resource[i].initiatorType == "img") {
                if (capture_resource[i].name.indexOf('www.demo.com OR YOUR URL') > -1) {
                    capture_network_request.push(capture_resource[i].name)
                }
            }
        }
        return capture_network_request;
    }
    report.push(console.errors, console.logs, captureNetworkRequest())

    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report));

    $('<a href="data:' + data + '" download="data.json">download JSON</a>').appendTo('#container');

}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}