const axios = require('axios');

function SendTeamsMessage(url, facts, title) {
    const data = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "0076D7",
        "summary": title + " - " + facts.length + " items",
        "sections": [{
            "activityTitle": title,
            "activitySubtitle": title + " - " + facts.length + " items",
            "facts": facts,
            "markdown": true
        }]
    };
    axios.post(url, JSON.stringify(data), {
        headers: {'Content-Type': 'application/json'}
    }).then((a) => {
        console.log('message sent');
        process.exit(0);
    }, (error) => {
        console.log(error);
        process.exit(0);
    })
}

module.exports = {SendTeamsMessage};

