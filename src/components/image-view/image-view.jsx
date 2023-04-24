import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import './image-view.scss';

import { connect } from 'react-redux';
import configData from "../../config.json";

export function ImageView() {
  const [imageKeys, setImageKeys] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [fileAlert, setFileAlert] = useState('');
  const [isUploading, setIsUploading] = useState(false);


  // after mount, fetch list of images
  useEffect(() => {
    getImages();
  }, []);


  // get image key list
  const getImages = () => {
    let token = localStorage.getItem('token');

    // get list of images
    axios.get(configData.API_URL + 'images', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // console.log(response);
        // save keys in array
        let imageKeys = [];
        response.data.Contents.forEach((element) => {
          if (element.Key != "original-images/") {
            imageKeys.push(element.Key.replace('original-images/', ''));
            // const url = await getImageUrl(element.Key);
            // console.log(url);
          }
        });
        setImageKeys(imageKeys);
        getThumbnailsUrls(imageKeys);
        return imageKeys;
      })
      .catch((error) => {
        console.log(error);
      })

  };

  // get list of thumbnail URLs
  const getThumbnailsUrls = (keys) => {
    let token = localStorage.getItem('token');
    let thumbnailUrls = [];

    const requests = [];
    keys.forEach((key) => {
      requests.push(axios.get(configData.API_URL + 'images/resized-images/' + key, {
        headers: { Authorization: `Bearer ${token}` }
      }));
    })
    axios.all(requests).
      then(
        axios.spread((...res) => {
          res.forEach(response => {
            thumbnailUrls.push(response.data.url);
          })
        })).then(() => {
          setImageUrls(thumbnailUrls);
        }
        )
      .catch(err => { console.log(err) });
  }

  // get signed image URL
  const getImageUrl = (key) => {
    let token = localStorage.getItem('token');

    axios.get(configData.API_URL + 'images/original-images/' + key, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        window.open(response.data.url, '_blank', 'noopener,noreferrer')
      })
      .catch(error => {
        console.log(error);
      })
  }

  const handleUpload = (event) => {
    event.preventDefault();
    if (isUploading === false) {
      setIsUploading(true)
      setFileAlert('Loading.')
      let token = localStorage.getItem('token');

      const inputFile = document.getElementById("fileInput").files[0];
      console.log(inputFile)
      const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
      const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      const file_extension = inputFile.name.split('.').slice(-1)[0].toLowerCase();

      if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(inputFile.type)) {
        setFileAlert('Not okay. Accepted file types: PNG, JPEG, JPG or GIF file.')
        return;
      }
      let formData = new FormData();
      formData.append("image", inputFile);

      console.log(inputFile);
      axios.post(configData.API_URL + 'images', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        setFileAlert('File successfully uploaded.');
      }
      ).catch(err => {
        setIsUploading(false);
      }
      );
    }
  }

  return (
    <>
      <h2 className="heading mb-4 mt-4">My images</h2>
      <Row md={{ offset: 3 }}>
        {(imageUrls.length > 0) && imageUrls.map((url, index) =>
          <Col xs={12} md={4} lg={3} className="main-grid-item mb-3" key={url}>

            <img src={url} className="image" title={imageKeys[index]} onClick={() => getImageUrl(imageKeys[index])} />

          </Col>
        )}
      </Row>

      <h2 className="heading mb-4 mt-4">Upload image</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Control type="file" size="lg" id="fileInput" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={event => { handleUpload(event) }} className="mt-4 float-right">
          Upload
        </Button>
      </Form >
      {(fileAlert != '') &&
        <p className='error'>{fileAlert}</p>
      }
    </>
  );
}

export default connect()(ImageView);