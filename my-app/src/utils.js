export const INPUT_TYPE_RANGE = ["text", "checkbox", "range"];

export function validateType(type){
    return INPUT_TYPE_RANGE.includes(type);
}

function reformatDanmuku(d){
    let p = d.getAttribute('p').split(",");

    function numberToColour(number) {
        const r = (number & 0xff0000) >> 16;
        const g = (number & 0x00ff00) >> 8;
        const b = (number & 0x0000ff);
       
        //return [b, g, r];
        return `rgb(${b},${g},${r})`;
    }

    return {
        ID: parseInt(p[7]),
        timestamp: parseFloat(p[0]),
        mode: parseInt(p[1]),
        color: numberToColour(p[3]),
        textContent: d.textContent,
    };
}

function parseDanmukuXML(xml) {
    /* parse xml text into a list of HTML elements*/
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    return xmlDoc.getElementsByTagName('d');

}

export async function createSchedule(xml) {
    /* parse xml text, create danmukuList and danmukuSchedule */
    let danmukuList = [];
    let danmukuSchedule = [];
    let danmukuIntervals = [];
    const danmukuElementList = parseDanmukuXML(xml);
    Array.from(danmukuElementList).forEach(function(el) {
        danmukuList.push(reformatDanmuku(el))
    })

    // sort danmukuList and create danmukuSchedule
    danmukuList.sort(function(d1, d2){
        return parseFloat(d1.timestamp) - parseFloat(d2.timestamp);
    });
    danmukuSchedule = danmukuList.map((d) => d.timestamp);
    danmukuSchedule.forEach((item, index, arr) => {
        danmukuIntervals.push(index == 0 ? 0 : arr[index] - arr[index-1]);
    });

    return [danmukuList, danmukuSchedule, danmukuIntervals];
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
