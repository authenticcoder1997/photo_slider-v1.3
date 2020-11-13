import React, { useState, useEffect } from 'react';
import { Loader } from './components/Loader';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import './components/App.css';

import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import Heading from './components/Heading'

// Style
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
  }
`;

const WrapperImages = styled.section`
  max-width: 120rem;
  margin: 4rem auto;
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: 300px;
`;

const App=()=> {
  var indexes=0;
  const [images, setImage] = useState([]);
  const [dispImg,setDisp]=useState('');
  const [cardIndex,setIndex]=useState(0);

  useEffect(() => {
    fetchImages();
  }, [])

  const fetchImages = (count = 10) => {
    const apiRoot = "https://api.unsplash.com";
    const accessKey = "_-7bxPNM099GVvmhMMEB7xRtQQTKmKnf3tPPI72X7lw";

    axios
      .get(`${apiRoot}/photos/random?client_id=${accessKey}&count=${count}`)
      .then(res => {
        setImage([...images, ...res.data]);
      })
  }
  const UnsplashImage = ({ url,  rurl,description}) => {
    console.log(indexes/2+" "+rurl+" "+description);
    indexes=indexes+1;
    return (
      <div className="card">
        <img src={url} alt={description} width= "100%" height="100%" object-fit="cover"/>
        <div className="card--info">
          <h1 className="card--title">{description}</h1>
          <br></br>
          <button onClick={()=>showImage(indexes/2,rurl)}>Preview</button>
        </div>
      </div>
    )
  };

  const [dispImgStyle,setStyle]=useState({display:'none'});
  let hashmap=new Map();
  images.map((image,index) =>
    hashmap.set(index,image.urls.regular)
  );
  const showImage=(key,rurl)=>{
      setDisp(rurl);
      setIndex(key);
      // cardIndex=key;
      setStyle({display:'flex'});
  }
  const closeDisp=()=>{
    setStyle({display:'none'});
  }

  // const breakpointColumnsObj = {
  //   default: 6,
  //   1200: 3,
  //   992:3,
  //   768:2,
  //   576:1,
  // };
  console.log(images);

  return (
    <>
    <div>
      <Heading/>
      <GlobalStyle />
      <InfiniteScroll
        dataLength={images.length}
        next={fetchImages}
        hasMore={true}
        loader={<Loader />}
      >
        {/* <Masonry breakpointCols={breakpointColumnsObj} className="container" columnClassName="container-grid_column"> */}
        <WrapperImages className="container">
          {images.map(image => (
            <UnsplashImage url={image.urls.small} rurl={image.urls.full} description={image.description}/>
          ))}
        </WrapperImages>
        {/* </Masonry> */}
      </InfiniteScroll>
    </div>
    <section className='lightbox' style={dispImgStyle}>
        <div className='close' onClick={closeDisp}>close</div>
        <div className='carousel left' onClick={()=>{
          let decrment=cardIndex-1;
          showImage(decrment,hashmap.get(decrment));
        }}>  
        </div>
        <div className='carousel right' onClick={()=>{
          let increment=cardIndex+1;
          showImage(increment,hashmap.get(increment));
        }}>
        </div>
        <img src={dispImg} alt="failed"/>
      </section>
    </>
  );
}

export default App;


