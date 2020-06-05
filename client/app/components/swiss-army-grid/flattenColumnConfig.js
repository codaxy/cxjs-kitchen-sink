import { isObject } from "cx/util";
import { getColumnHeaderText } from "./getComplexColumnHeaderText";

function processConfig(result, config, process, level, parent) {
    for (let field in config) {
        if (!isObject(config[field]))
            continue;
        let c = {
            ...config[field],
            field,
        };
        let header = isObject(c.header) ? c.header : { text: c.header };
        c.header = {
            ...header,
            parent,
            level,
            text: getColumnHeaderText(c)
        };
        if (c.columns) {
            c.header.allowSorting = false;
            if (c.header.align == null)
                c.header.align = "center";
            processConfig(result, c.columns, process, level + 1, c.header);
            delete c.columns;
        }
        else {
            if (process) c = process(c);
            result[field] = c;
        }
    }
}

export function flattenColumnConfig(config, process) {
    let result = {};
    processConfig(result, config, process, 1, null);
    return result;
}