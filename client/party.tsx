declare var require: any

import * as React from 'react';
/*! Copyright TXPCo, 2020 */

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'

import * as CSS from 'csstype';

const bannerRowStyle: CSS.Properties = {
   lineHeight: '48px', margin: '0px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px', alignItems: 'center' 
};

const partyImageStyle: CSS.Properties = {
   marginLeft: '0px', marginRight: '0px',
   paddingLeft: '4px', paddingRight: '2px',
   paddingTop: '0px', paddingBottom: '0px',
   marginTop: '8px', marginBottom: '8px',
   display: 'inline-block'
};

const partySmallImageStyle: CSS.Properties = {
   marginLeft: '0px', marginRight: '0px', paddingLeft: '2px', paddingRight: '2px', paddingTop: '0px', paddingBottom: '0px', marginTop: '2px', marginBottom: '2px'
};

const partyNameStyle: CSS.Properties = {
   fontSize: '14px',
   margin: '0px', paddingLeft: '4px',
   paddingRight: '4px', paddingTop: '0px',
   paddingBottom: '0px', wordBreak: 'break-all',
   display: 'inline-block'
};

const partyBannerNameStyle: CSS.Properties = {
   fontSize: '32px',
   margin: '0px', paddingLeft: '4px',
   paddingRight: '4px', paddingTop: '0px',
   paddingBottom: '0px', alignItems: 'center',
   display: 'inline-block'
};

const partyRowStyle: CSS.Properties = {
   lineHeight: '14px',
   margin: '0px',
   paddingLeft: '4px',
   paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px',
   alignItems: 'left',
   display: 'inline-block'
};

const thinStyle: CSS.Properties = {
   margin: '0px', padding: '0px'
};

export const PartyBanner = (props: { name: string, thumbnailUrl: string }) => (
   <div>
      <Container fluid style={thinStyle}>
         <Row style={{ bannerRowStyle}}>
            <Image style={partyImageStyle} src={props.thumbnailUrl} alt={props.name} title={props.name} height='32px' />
            <p style={partyBannerNameStyle}>{props.name}</p>
         </Row>
      </Container>
   </div>
);

export const Party = (props: { name: string, thumbnailUrl: string }) => (
   <div>
      <Container style={thinStyle}>
         <Row style={partyRowStyle}>
            <Col style={thinStyle}>
               <Image style={partyImageStyle} src={props.thumbnailUrl} alt={props.name} title={props.name} height='32px' />
                  <p style={partyNameStyle}>{props.name}</p>
            </Col>
         </Row>
      </Container>
   </div>
);

export const PartyNoImage = (props: { name: string } ) => (
   <div>
      <Container style={thinStyle}>
         <Row style={partyRowStyle}>
            <Col style={thinStyle}>
               <p style={partyNameStyle}>{props.name}</p>
            </Col>
         </Row>
      </Container>
   </div>
);

export const PartyCaption = (props: { name: string, caption: string, thumbnailUrl: string }) => (
   <div>
      <Container style={thinStyle}>
         <Row style={partyRowStyle}>
            <Col style={thinStyle}>
               <Image style={partyImageStyle} src={props.thumbnailUrl} alt={props.caption} title={props.caption} height='32px' />
               <p style={partyNameStyle}>{props.name}</p>
            </Col>
         </Row>
      </Container>
   </div>
);

export const PartySmall = (props: { name: string, thumbnailUrl: string }) => (
   <Image style={partySmallImageStyle} src={props.thumbnailUrl} alt={props.name} title={props.name} height='32px'/>
);

