const url = `http://${window.location.hostname}:${window.location.port}/`;
const userBucket = window.location.search.substring(1, window.location.search.length);

$(document).ready(function () {
    $("form").submit((e) => {
        e.preventDefault();
        const bucket = userBucket;
        const file = $(`#uploadDoc`).prop('files') ? $(`#uploadDoc`).prop('files')[0] : null;
        if (!file) {
            alert('Please select a file');
            return;
        }
        const data = new FormData(file);
        var r = new FileReader();
        r.onload = function(){
            data.append('file', r.result);
            data.append('bucket', bucket);
            data.append('fileName', file.name);
            $.ajax({
                type: "POST",
                url: url + 'upload',
                data: data,
                processData: false,
                contentType: false,
                success: () => {
                    alert('File uploaded successfully');
                },
                error: (err) => {
                    console.log(err);
                    alert('File uploaded failure');
                }
            });
        };
        r.readAsBinaryString(file);
    })
    $.get(url + 'getBuckets', function( data ) {
        const selectedBucket = data.buckets.filter(obj => userBucket === obj.bucket);
        if (!selectedBucket.length) {
            alert('Invalid bucket name');
            return false;
        }
    });
});
