export const msToHMS = (date: number): any => {
    let ms = date;
    ms = 1000 * Math.round(ms / 1000); // round to nearest second
    const d = new Date(ms);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes();
    const s = d.getUTCSeconds();
    return { h, m, s};
};

export const hMSToMs = ({ h, m, s }: any): any => {
    let ms = h * 3.6e+6;
    ms += m * 60000;
    ms += s * 1000;
    return ms;
};

export const slugify = (string: string): string => {
    const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'; // bad
    const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------'; // Replace by
    const p = new RegExp(a.split('').join('|'), 'g'); // build the regex

    // because some component have link value with possible null value
    if (!string) {
        return ''
    }

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word characters
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text
};

export const addToObject = (obj: any, key: string, value: any, index: number) => {

    // Create a temp object and index variable
    let temp: any = {};
    let i = 0;

    // Loop through the original object
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {

            // If the indexes match, add the new item
            if (i === index && key && value) {
                temp[key] = value;
            }

            // Add the current item in the loop to the temp obj
            temp[prop] = obj[prop];

            i++;
        }
    }

    // If no index, add to the end
    if (!index && key && value) {
        temp[key] = value;
    }

    return temp;
};

export const logout = () => {
    localStorage.clear()
};
