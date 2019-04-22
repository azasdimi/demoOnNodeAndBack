import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

//Promise<{[key: string]: any }> : That means that the promise will have a property that will be interpreted as a string and we don't care about the name
//The [] here don't indicate an array but only indicate that this is just a dynamic property
export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof control.value === "string") {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  const frObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      //have a listener listen on loadend event which is equivalent to fileReader.onloadend
      fileReader.addEventListener("loadend", () => {});
      //create a new array of 8 bit unsigned integer. This allows us to access and read certain patterns in the file and the file's
      //metadata that we can then use to parse the mimetype bcs we just don't want to check the file extension we want to really in
      //infere the filetype by looking into the file and Uint8Array allows us to do so. And that is why we read it as a buffer bcs
      //we can easily convert it using uint8array. The subarray(0,4) is the part of the array that allows us to get the mimetype.
      const arr = new Uint8Array(fileReader.result).subarray(0, 4);
      let header = "";
      let isValid = false;
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }
      if (isValid) {
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    }
  );
  fileReader.readAsArrayBuffer(file);
  return frObs;
};
