import axios from "axios";
import FormData from 'form-data'

export const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
        files.map((file) => {
            return uploadImgur(file);
        })
    );
    callback(res.map((item) => item));
};

export const customUploadButton = (targetElement,valSetter) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const target = e.target;
        const file = target.files[0];
        const url = await uploadImgur(file);
        insertAtCursor(targetElement, `![](${url})`, valSetter);
        input.remove();
    }
    input.click();
}

export function insertAtCursor(myField, myValue, valueSetter) {
    //IE support
    console.log(myField)
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        valueSetter(myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length));
    } else {
        valueSetter(myField.value + myValue);
    }
}

export const uploadImgur = (data) => {
    return new Promise((resolve, reject) => {
        var formdata = new FormData();
        formdata.append("image", data);
        axios({
            method: 'post',
            url: 'https://api.imgur.com/3/image',
            headers: {
                'Authorization': 'Client-ID ' + 'b78d7ae7c2e4207',
                'Content-Type': 'multipart/form-data',
            },
            data: formdata
        }).then(res => {
            resolve(res.data.data.link);
        }).catch(err => {
            console.log(err)
            reject(err);
        })
    })
}