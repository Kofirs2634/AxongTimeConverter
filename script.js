const amonths = ['primum', 'secundum', 'tetrium', 'quartum', 'quintum', 'sextum', 'septimum', 'octavum', 'nonum', 'decimum', 'undecimum', 'duodecimum'],
    emonths = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    config = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'utc', era: 'short' },
    configwTime = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'utc', timeZoneName: 'short', era: 'short' };
function isLeap(year) { return (!(year % 400) || (!(year % 4) && !!(year % 100))) }
function lead(x, z) {
    x = String(x);
    let dummy = '0'.repeat(z)
    return dummy.substr(x.length) + x
}

for (let d = 1; d <= 31; d++) $('#ta-day').append($('<option>', { text: d, value: d }))
for (let d = 1; d <= 28; d++) $('#te-day').append($('<option>', { text: d, value: d }))
emonths.forEach((e, n) => {
    $('#ta-month').append($('<option>', { text: e, value: n + 1 }))
})
amonths.forEach((e, n) => {
    $('#te-month').append($('<option>', { text: e, value: n + 1 }))
})

let nowEarth = new Date(),
    nowAxong = toAxong(nowEarth.getTime());

// вставляем текущие даты
// для Земли
$(`#ta-day [value="${nowEarth.getUTCDate()}"]`).attr('selected', '1')
$(`#ta-month [value="${nowEarth.getUTCMonth() + 1}"]`).attr('selected', '1')
$(`#ta-year`).val(nowEarth.getUTCFullYear())
$(`#ta-hour`).val(lead(nowEarth.getUTCHours(), 2))
$(`#ta-minute`).val(lead(nowEarth.getUTCMinutes(), 2))
$(`#ta-second`).val(lead(nowEarth.getUTCSeconds(), 2))
// для Ахонга
$(`#te-day [value="${nowAxong.day}"]`).attr('selected', '1')
$(`#te-month [value="${nowAxong.month}"]`).attr('selected', '1')
$(`#te-year`).val(nowAxong.year)
$(`#te-hour`).val(nowAxong.hour)
$(`#te-minute`).val(lead(nowAxong.minute, 2))
$(`#te-second`).val(lead(nowAxong.second, 2))

$('#ta-go').click(() => {
    let date = new Date(Date.parse(`${lead($('#ta-year').val(), 4)}-${lead($('#ta-month').val(), 2)}-${lead($('#ta-day').val(), 2)}T${lead($('#ta-hour').val(), 2)}:${lead($('#ta-minute').val(), 2)}:${lead($('#ta-second').val(), 2)}Z`)),
        data = toAxong(date.getTime()),
        hasTime = $('#ta-time').prop('checked');
    if (hasTime) $('#output').text(`${data.day} ${amonths[data.month - 1]} ${data.year} ${lead(data.hour, 2)}:${lead(data.minute, 2)}:${lead(data.second, 2)} APT`)
    else $('#output').text(`${data.day} ${amonths[data.month - 1]} ${data.year}`)
})

$('#te-go').click(() => {
    let millis = 946684800 + 0.87093 * $('#te-second').val() + 87.093 * $('#te-minute').val() + 8709.3 * $('#te-hour').val() + 87093 * ($('#te-day').val() - 1) + 2438604 * ($('#te-month').val() - 1) + 29263248 * ($('#te-year').val() - 500),
        hasTime = $('#te-time').prop('checked');
    if (hasTime) $('#output').text(new Date(millis * 1000).toLocaleString('ru', configwTime))
    else $('#output').text(new Date(millis * 1000).toLocaleString('ru', config))
})

function toAxong(millis) {
    let si = (millis / 1000 - 946684800) / 0.87093,
        py = si / 336e5,
        pm = py % 1 * 12,
        pd = pm % 1 * 28,
        ph = pd % 1 * 10,
        pmi = ph % 1 * 100,
        ps = pmi % 1 * 100,
        y = 500 + Math.floor(py),
        m = 1 + Math.abs(Math.floor(pm)),
        d = 1 + Math.abs(Math.floor(pd));
    return { year: y, month: m, day: d, hour: Math.abs(Math.floor(ph)), minute: Math.abs(Math.floor(pmi)), second: Math.abs(Math.floor(ps)) }
}