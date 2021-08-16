import React, { useState, useEffect } from "react";
import { useStyles } from "./style";
import { Container, Typography } from "@material-ui/core";
import Images from "./Images";
import { storage, database } from "../../../../firebase";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Toast } from "react-bootstrap";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
export default function Photos() {
  const classes = useStyles();

  const [uploadingFiles, setUploadingFiles] = useState([]);

  const [emptyPhoto, setEmptyPhoto] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (file == null) return;

    const fileName = uploadingFiles.length;
    const filePath = `/images/${fileName}`;

    const uploadTask = storage.ref(`${filePath}`).put(file);

    uploadTask.on(
      "state_changed",

      //progress code
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
      },
      // error code
      () => {},

      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setUploadingFiles([
            ...uploadingFiles,
            {
              id: (uploadingFiles.length + 1).toString(),
              fName: fileName,
              thumb: url,
            },
          ]);
          e.target.value = null;
        });

        const items = Array.from(emptyPhoto);
        items.splice(0, 1);
        setEmptyPhoto(items);
      }
    );
  };

  // this code to delte images from storage
  const deleteImages = (id) => {
    const fileName = uploadingFiles.filter((arr) => arr.id === id);
    // console.log(fileName)
    storage
      .ref(`images/`)
      .listAll()
      .then((listResults) => {
        const promises = listResults.items.map((item) => {
          // console.log( uploadingFiles.filter(arr=> arr.id === id)[0].fName)
          if (
            item.name == uploadingFiles.filter((arr) => arr.id === id)[0].fName
          ) {
            return item.delete();
          }
        });
        Promise.all(promises);
      });

    setUploadingFiles(uploadingFiles.filter((arr) => arr.id != id));
    const items = Array.from(emptyPhoto);
        items.push("")
        setEmptyPhoto(items);
  };

  const getImages = () => {
    let ur = [];
    storage
      .ref(`images/`)
      .listAll()
      .then((listResults) => {
        const promises = listResults.items.map((item, index) => {});

        Promise.all(promises);
      });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(uploadingFiles);
    const [reorderItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderItem);

    setUploadingFiles(items);
  };
  return (
    <div>
      <Container maxWidth="xl" className={classes.parentContainer}>
        <Typography variant="h6" className={classes.PhotosHeading}>
          UPLOAD UP TO 10 PHOTOS
        </Typography>
      </Container>

      <label style={{ width: "90%", height: "250px" }}>
        <input
          type="file"
          id="click"
          className={classes.input}
          onChange={handleUpload}
          multiple="multiple"
          accept="image/*"
        />
        <Container
          style={{ margin:"10px 10px 10px 100px"}}
          htmlFor="click"
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            
            <Droppable droppableId="characters" maxWidth="xl">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ display: "flex", flexWrap: "wrap", justifyContent: 'space-between' }}
                >
                  {uploadingFiles.map((arr, index) => {
                    return (
                      arr.thumb !== "" && (
                        <Draggable
                          key={index}
                          draggableId={(index + 1).toString()}
                          index={index}
                        >
                          {(provided) => (
                            // <li>
                            <div
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                            >
                              <Images
                                key={index}
                                forDelete={deleteImages}
                                imgSrc={arr}
                              />
                            </div>
                            // </li>
                          )}
                        </Draggable>
                      )
                    );
                  })}

                  {provided.placeholder}
                  {emptyPhoto.map((filtArr, index) => {
                    return (
                      <Toast
                        style={{ width: "110px", height: "130px" }}
                        key={`${index}photo`}
                      >
                        <Toast.Body>
                          <AddAPhotoIcon className={classes.img} />
                        </Toast.Body>
                      </Toast>
                    );
                  })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Container>
      </label>
    </div>
  );
}
