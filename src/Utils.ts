export function chunk(a:any[], size:number): any[][] {
    return a.reduce((ra, itm, idx) => { 
        const cIdx = Math.floor(idx/size);

        if(!ra[cIdx]) ra[cIdx] = [];
        ra[cIdx].push(itm)

        return ra;
    }, []);
}

export function arrayDiff(a:any[], b:any[]) {
    return [
        ...a.filter(x => b.indexOf(x) === -1),
        ...b.filter(x => a.indexOf(x) === -1)
    ];
}

export function idToIdx(firmId:string):number[] {
    const [cellId, subId] = firmId.split('|').map(v => parseInt(v));
    const rowIdx = Math.floor(cellId / 3) * 3 + Math.floor(subId / 3);
    const colIdx = (cellId % 3) * 3 + (subId % 3);
    return [rowIdx, colIdx];
}

// export function idxToId(rowIdx:number, colIdx:number):string {
    
// }