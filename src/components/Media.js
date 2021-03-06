import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { expandMedia } from "actions/media";
import { media } from "styles/utils";

import Video from "./Video";
import YouTube from "./YouTube";
import Map from "./Map";
import MapBox from "./MapBox";
import Gallery from "./Gallery";
import detectIt from 'detect-it';

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  transition: all 0.2s ease-in-out;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  // @media(max-width: 800px) {
  //   width:100vw;
  //   height:100vh;
  // }
  
  .media-embed {
    width: 100%;
    height: 100%;
    pointer-events:auto;
  }

  @media(max-width: 439px){
    width:100vw !important;
    height:100vh !important;
    .media-embed {
      pointer-events:none;
    }
  }
  
  .placeholder-background {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width:100%;
    height:100vh;
  }

  @media(min-width: 1000px) and (max-width: 1500px){
    .placeholder-background {
      .mapboxgl-map {
        width:100%!important;
      }
    }
  }
  ${props =>
    props.preview &&
    css`
      box-shadow: 0 0 5rem rgba(0, 0, 0, 0.2);
      border-top: 1px solid #444;
      flex: 0 0 auto;
      height: 90px;
      ${props =>
        props.active &&
        css`
          height: 50vh;
      `} 
      @media(min-width: 540px) {
        display: flex !important;
        flex: 0 0 45%;
        border-top: 0;
        box-shadow: 0 0 0;
      };
      ${media.desktop`
        display: flex !important;
        flex: 0 0 45%;
        border-top: 0;
        max-width: 600px;
        height: auto;
        box-shadow: 0 0 0;
      `} 
      ${media.desktopHD`
        display: flex !important;
        flex: 0 0 40%;
      `}
      ${media.phone`
        display:none;
      `};
      ${media.phablet`
        display:none;
      `};
    `} &.clickable {
    cursor: pointer;
  }
  .leaflet-container {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: inherit;
    overflow: hidden;
  }
  ${props =>
    props.parallax &&
    css`
      box-shadow: 0 0 5rem rgba(0, 0, 0, 0.2);
      border-top: 1px solid #444;
      flex: 0 0 auto;
      height: 90px;
    ${props =>
      true &&
      css`
        height: 50vh;
      `} ${media.desktop`
    flex: 0 0 45%;
    border-top: 0;
    max-width: 600px;
    height: auto;
    box-shadow: 0 0 0;
  `} ${media.desktopHD`
    flex: 0 0 40%;
  `};
  `} &.clickable {
  cursor: pointer;
    .parallax-container {
      width: 100%;
      min-height: 100%;
      position: absolute;
    } &.clickable {
    cursor: pointer;
  }
  
`;

const Expand = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  text-align: center;
  color: #fff;
  ${media.desktop`
    display: none;
  `}
    .fa {
    font-size: 2em;
    margin: 5%;
  }
`;

const Credits = styled.p`
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 3;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 0.6em;
  padding: 0.25rem 0.5rem;
`;

class Media extends Component {
  static propTypes = {
    media: PropTypes.object
  };
  static defaultProps = {
    media: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
    this._handleClick = this._handleClick.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
  }
  componentDidMount() {
    this.node = findDOMNode(this);
    window.addEventListener("touchstart", this.handleTouchStart,detectIt.passiveEvents ? {passive:true} : false);
  }
  componentWillUnmount() {
    window.removeEventListener("touchstart", this.handleTouchStart);
  }
  handleTouchStart(ev) {
    if (ev.target !== this.node && !this.node.contains(ev.target)) {
      if (this.state.active) {
        this.setState({ active: false });
      }
    } else if (!this.state.active) {
      ev.preventDefault();
      this.setState({ active: true });
    }
  }
  detectWebGLContext () {
    // https://developer.mozilla.org/en-US/docs/Learn/WebGL/By_example/Detect_WebGL
    // Create canvas element. The canvas is not added to the
    // document itself, so it is never displayed in the
    // browser window.
    var canvas = document.createElement("canvas");
    // Get WebGLRenderingContext from canvas element.
    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    // Report the result.
    if (gl && gl instanceof WebGLRenderingContext) {
      console.log('YES, BROWSER HAS WEBGL SUPPORT. SHOWING MAPBOX!');
      return true;
    } else {
      console.log('BROWSER NOT SUPPORTS WEBGL RENDERING CONTEXT TO OPEN MAPBOX. SHOWING BACKGROUND IMAGE INSTEAD.');
      return false
    }
  }
  _handleClick(ev) {
    ev.preventDefault();
    this.props.expandMedia(true);
  }
  render() {
    const { active } = this.state;
    const { media, preview, children, parallax } = this.props;

    let credits;
    if (media && media.data)
      credits = media.data.credits || process.env.DEFAULT_CREDITS;

    switch (media.type) {
      case "video": {
        return (
          <Wrapper preview={preview}>
            <Video data={media.data} preview={preview || false} />
          </Wrapper>
        );
      }
      case "youtube": {
        return (
          <Wrapper preview={preview}>
          {(preview == undefined && ((typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1))) &&
            <YouTube data={media.data} preview={preview || false} />
          }
          {(preview !== undefined && ((typeof window.orientation === "undefined") || (navigator.userAgent.indexOf('IEMobile') === -1))) &&
            <YouTube data={media.data} preview={preview || false} />
          }
          </Wrapper>
        );
      }
      case "gallery": {
        return (
          <Wrapper preview={preview}>
            <Gallery data={media.data} preview={preview || false} />
            {credits ? <Credits>{credits}</Credits> : null}
          </Wrapper>
        );
      }
      case "map": {
        return (
          <Wrapper preview={preview} active={active}>
            <Map {...media.data} />
          </Wrapper>
        );
      }
      case "mapbox": {
        return (
          <Wrapper preview={preview} parallax={parallax} active={active}>
            <div className='placeholder-background' style={{'backgroundImage':`url(${media.backgroundAlternative})`}}>            
              {this.detectWebGLContext() &&
                <MapBox {...media.data} />
              }
            </div>
          </Wrapper>
        );
      }
      case "vr": {
        return <Wrapper preview={preview} />;
      }
      case "image": {
        if (preview) {
          return (
            <Wrapper
              preview={true}
              className="clickable"
              onClick={this._handleClick}
              style={{
                backgroundImage: `url(${media.data.src})`
              }}
            >
              {credits ? <Credits>{credits}</Credits> : null}
            </Wrapper>
          );
        } else {
          return (
            <Wrapper>
              <img src={media.data.src} />
              {credits ? <Credits>{credits}</Credits> : null}
            </Wrapper>
          );
        }
      }
      case "embed": {
        return (
          <Wrapper preview={preview || false} active={active}>
            <iframe
              className="media-embed"
              src={media.data.src}
              frameBorder="0"
              allowFullScreen
            />
            {!active ? (
              <Expand>
                <span></span>
              </Expand>
            ) : null}
        </Wrapper>
        );
      }
      default: {
        return (
          <Wrapper preview={preview} active={active}>
            { }
            {children}
          </Wrapper>
        );
      }
    }
  }
}

const mapDispatchToProps = {
  expandMedia
};

export default connect(null, mapDispatchToProps)(Media);
