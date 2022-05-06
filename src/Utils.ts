export function chunk(a:any[], size:number): any[][] {
    return a.reduce((ra, itm, idx) => { 
        const cIdx = Math.floor(idx/size);

        if(!ra[cIdx]) ra[cIdx] = [];
        ra[cIdx].push(itm)

        return ra;
    }, []);
}