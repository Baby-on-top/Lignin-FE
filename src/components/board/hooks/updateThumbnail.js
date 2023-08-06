import html2canvas from "html2canvas";
import { WidgetType } from "../WidgetType";
import { imageUpload, widgetImageUpdate } from "../../../utils/apis";

export const getThumbnail = (type, id) => {
  let className = "note-editor";
  if (type === WidgetType.CALENDAR) {
    className = "calendar-widget";
  }
  if (type === WidgetType.DRAWING) {
    className = "tldraw";
  }
  const captureDiv = document.getElementsByClassName(className)[0];
  makeDivToImageFile(captureDiv, id);
};

function makeDivToImageFile(captureDiv, id) {
  html2canvas(captureDiv, {
    allowTaint: true,
    useCORS: true,
    width: captureDiv.offsetWidth,
    height: captureDiv.offsetHeight,
    scale: 1,
  })
    .then(async function (canvas) {
      // 캔버스 이미지를 Blob 객체로 변환합니다.
      canvas.toBlob(async (blob) => {
        // 캔버스 이미지를 FormData로 변환합니다.
        const formData = new FormData();
        formData.append("file", blob, "capture.png"); // 마지막 인자는 업로드된 이미지의 원하는 파일명입니다.

        const response = await imageUpload(formData);
        const imageURL = response.data;

        const response2 = await widgetImageUpdate(id, imageURL);
        console.log(response2);
      }, "image/png"); // Blob의 MIME 타입을 지정합니다. 여기서는 PNG 이미지로 지정하였습니다.
    })
    .catch(function (e) {
      console.error(e);
    });
}
