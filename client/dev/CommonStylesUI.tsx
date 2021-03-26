/*! Copyright TXPCo, 2020, 2021 */

// Core React
import ReactDOM from 'react-dom';
import * as React from 'react';
import * as CSS from 'csstype';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


//==========
// Common styles
//==========

export const cmnNoMarginPad: CSS.Properties = {
   margin: '0px', padding: '0px'
};

export const cmnThinMarginPad: CSS.Properties = {
   margin: '2px', padding: '0px',
};

export const cmnExtraTopPad: CSS.Properties = {
   marginTop: '20px'
};

export const cmnExtraBtmPad: CSS.Properties = {
   marginBottom: '20px'
};

export const cmnToolButtonStyle: CSS.Properties = {
   margin: '2px', padding: '2px',
   fontSize: '14px'
};

export const cmnNavButtonStyle: CSS.Properties = {
   marginLeft: '4px',
   marginRight: '4px',
   marginTop: '0px',
   marginBottom: '0px',
   borderWidth: "1px",
   borderColor: "black",
   borderStyle: 'solid'
};

export const cmnDialogButtonStyle: CSS.Properties = {
   marginLeft: '0px',
   marginRight: '8px',
   marginTop: '0px',
   marginBottom: '0px',
   borderWidth: "1px",
   borderColor: "black",
   borderStyle: 'solid'
};

export const cmnOffsetDialogButtonStyle: CSS.Properties = {
   marginLeft: '14px',
   marginRight: '8px',
   marginTop: '0px',
   marginBottom: '0px',
   borderWidth: "1px",
   borderColor: "black",
   borderStyle: 'solid'
};

export const cmnOffsetDialogFieldStyle: CSS.Properties = {
   marginLeft: '8px',
   marginRight: '40px'
};

//==========
// Main page styles
//==========

export const navbarStyle: CSS.Properties = {
   margin: '0px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '4px', paddingBottom: '0px', background: 'gray', color : 'white'
};

export const navbarBrandStyle: CSS.Properties = {
   margin: '0px', padding: '0px', background: 'gray',  color: 'white'
};

export const pageStyle: CSS.Properties = {
   background: 'gray', color: 'white', padding: '0px'
};

export const pageTopDividerStyle: CSS.Properties = {
   marginTop: '20px',
   paddingTop: '20px',
   borderTopWidth: "1px",
   borderTopColor: "black",
   borderTopStyle: 'solid'
};

export const pageLeftDividerStyle: CSS.Properties = {
   borderLeftWidth: "1px",
   borderLeftColor: "black",
   borderLeftStyle: 'solid'
};

export const pageHeaderStyle: CSS.Properties = {
   color: "black",
   alignContent: 'centre',
   alignItems: 'centre',
   fontSize: '24px'
};

export const pageSubStyle: CSS.Properties = {
   color: '#292929',
   alignContent: 'centre',
   alignItems: 'centre',
   fontSize: '14px'
};

export const pageParaStyle: CSS.Properties = {
   color: '#292929',
   alignContent: 'left',
   alignItems: 'left',
   textAlign: 'left',
   fontSize: '14px'
};

//==========
// Landing page styles
//==========
export const landingJumbotronStyle: CSS.Properties = {
   paddingLeft: '10px',
   paddingRight: '10px',
   marginBottom: '0px',
   background: 'white',
   color: 'gray',
   alignContent: 'centre',
   alignItems: 'centre'
};

export const landingFadeExtraBtmPad: CSS.Properties = {
   marginBottom: '20px',
   color: 'gray'
};

export const landingMobileImageStyle: CSS.Properties = {
   width: '320px',
   opacity: '50%'
};

export const landingImageStyle: CSS.Properties = {
   width: '480px',
   opacity: '65%'
};

export const landingNavGroupStyle: CSS.Properties = {
   margin: '0px', padding: '0px',
   textAlign: 'center',
   verticalAlign: 'middle'
};

export const landingPanelStyle: CSS.Properties = {
   marginTop: '0px', paddingTop: '0px',
   marginBottom: '0px', paddingBottom: '0px',
   marginLeft: '8px', paddingLeft: '0px',
   marginRight: '8px', paddingRight: '0px'
};

//==========
// Clock
//==========

export const clockStyle: CSS.Properties = {
   color: 'red', fontFamily: 'digital-clock', fontSize: '64px', margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px'
};

//==========
// Footer
//==========

const footerElementStyle: CSS.Properties = {
   padding: '10px',
   fontSize: '14px',
   color: 'white'
};

export class Footer extends React.Component {
   render() {
      return (
         <div>
            <Container>
               <Row>
                  <Col>
                     <a style={footerElementStyle} href="/">Home</a>
                     <a style={footerElementStyle} href="privacy">Privacy</a>
                     <a style={footerElementStyle} href="terms">Terms</a>
                     <a style={footerElementStyle} href="faq">FAQ</a>
                     <a style={footerElementStyle} href="mailto:ultrabox.service@gmail.com">Contact Us</a>
                  </Col>
               </Row>
            </Container>
         </div>);
   }
}
