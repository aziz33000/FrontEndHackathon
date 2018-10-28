import { MockRequest } from '@delon/mock';

const list = [];
const rawdatas = [];
const toolname = ['File', 'Select', 'Combine', 'GroupBy'];
const tooltype = [1, 2];

for (let i = 0; i < 4; i += 1) {
    
    list.push({
        id: i,
        name: toolname[i],
        version: '1.0.0',
        type: tooltype[i== 0 ? 1 : 0],
        inputFile: i == 0 ? true : false,
    });
}

for (let i = 0; i < 3; i += 1) {
    rawdatas.push({
        id: i,
        name: 'Csv_File' + i + '.csv',
        url: '/home/huang/file/' + i,
        createdAt: new Date(),
    });
}

function getTools(params: any) {
    let ret = [...list];
    if (params != 0) {
        ret = ret.filter(data => data.type == params);
    }
    return ret;
}

function getRawDatas() {
    let ret = [...rawdatas];
    return ret;
}

function saveRawData(data) {
    rawdatas.unshift({
        id: data.id,
        name: data.name,
        url: data.url,
        createdAt: new Date(),
    });
}

function removeRawData(data) {
    const idx = list.findIndex(w => w.no === data.no);
    if (idx !== -1) list.splice(idx, 1);
    return true;
}

function check(data) {
    /* const sourcenode = _.find(list, { id: parseInt(data.sourcenode) });
    const targetnode = _.find(list, { id: parseInt(data.targetnode) });
    if (targetnode.inputFileSuffix.length == 0) {
        return true;
    } else {
        return _.intersection(sourcenode.outputFileSuffix, targetnode.inputFileSuffix).length == 0 ? false : true;
    } */
    return true;
}

export const TOOLS = {
    'POST /tool': (req: MockRequest) => getTools(req.body.type),
    'POST /tool/check': (req: MockRequest) => check(req.body),
    '/tool/:id': (req: MockRequest) => list.find(w => w.id === +req.params.id),
    '/rawdata': () => getRawDatas(),
    'POST /rawdata': (req: MockRequest) => saveRawData(req.body),
    'DELETE /rawdata': (req: MockRequest) => removeRawData(req.queryString),
};
