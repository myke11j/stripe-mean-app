function prepareUpload(elem) {
    const bucket = $(elem).attr('id');
    console.log($(`#${bucket}-input`).prop('files'));
}

$(document).ready(function () {
    const url = `http://${window.location.hostname}:${window.location.port}/`
    $.get(url + 'getBuckets', function( data ) {
        data.buckets.map((bucket, index) => {
            const component = {};
            if (index === 0) {
                component.tab = `<li class="active"><a data-toggle="tab" href="#${bucket}">${bucket}</a></li>`;
                component.section = `<div id="${bucket}" class="tab-pane fade in active bd-example">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="${bucket}">
                        <label class="custom-file-label" for="${bucket}">
                            Choose file to Upload in bucket ${bucket}
                        </label>
                    </div>
                </div>`;
            } else {
                component.tab = `<li><a data-toggle="tab" href="#${bucket}">${bucket}</a></li>`;
                component.section = `<div id="${bucket}" class="tab-pane fade bd-example">
                    <div class="custom-file">
                        <input type="file" class="custom-file-input" id="${bucket}-input">
                        <label class="custom-file-label" for="${bucket}">
                            Choose file to Upload in bucket ${bucket}
                        </label>
                        <button onclick="prepareUpload(this)" text="submit" id="${bucket}"/>
                    </div>
                </div>`;
            }
            $('#uploader-tab').append(component.tab);
            $('#uploader-section').append(component.section);
        });
    });
});
