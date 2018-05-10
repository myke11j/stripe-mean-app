const url = `http://${window.location.hostname}:${window.location.port}/`;
const userBucket = window.location.search.substring(1, window.location.search.length);

$(document).ready(function () {
    $('#uploadForm').submit(function(e) {
        e.preventDefault();
        // $("#bucket").val(userBucket)
        $(this).ajaxSubmit({
            data: { bucket: userBucket },
            error: function(xhr) {
                alert('Error: ' + xhr.status);
            },

            success: function(response) {
                alert(response.message)
            }
        });
    });

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
            data.append('bucket', bucket);
            data.append('fileName', file.name);
            data.append('file', r.result);
            
            $.ajax({
                type: "POST",
                url: url + 'upload',
                data,
                processData: false,
                contentType: 'multipart/form-data',
                dataType: 'json',
                success: () => {
                    alert('File uploaded successfully');
                },
                error: (err) => {
                    console.log(err);
                    alert('File uploaded failure');
                }
            });
        };
        r.readAsArrayBuffer(file);
    })
    $.get(url + 'getBuckets', function( data ) {
        const selectedBucket = data.buckets.filter(obj => userBucket === obj.bucket);
        if (!selectedBucket.length) {
            alert('Invalid bucket name');
            return false;
        }
    });
});
